---
title: Buffer MA
layout: page
---
## Buffer MA

Very often we find ourselves working with .ma files, which are totally readable as text!
Wouldn't it be great if we could use that to our advantage?

This tool does a very simple parse of the .ma file to grab anim curves of the same name as those currently selected (ie from an older version of the same file), and applies it to the buffer curve of that same anim curve.

So you can pull back animation from old files to inspect, use as reference or outright revert back to.

{% highlight python %}
# Import previous version maya ascii file animCurve as buffer curve.
# Assumption is that the anim curve is named the same and is present in file.

import maya.cmds as cmds
import tempfile
import os.path
import shutil
import shlex
import re

CURVE = re.compile(r"\s*createNode animCurve[TU][LUTA].+\-n\s+\"([^\"]+)\".*?;")
COMMANDS = ("file", "requires", "createNode", "parent", "connectAttr", "disconnectAttr", "select", "currentUnit", "fileInfo")

def statement(parser):
    for token in parser:
        if token == ";":
            break
        yield token

def get_anim(path, curves):
    curves = set(curves)
    with open(path, "rb") as f:
        if f.read(6) != "//Maya":
            raise RuntimeError("Not a Maya Ascii file: %s" % path)
        f.seek(0)

        parser = shlex.shlex(f, posix=True)
        parser.commenters = "//"
        parser.wordchars += ".-:"
        for line in iter(f.readline, ""):
            if not curves: break
            header = CURVE.match(line) # Could parse whole file. But regex to location is faster
            if header and header.group(1) in curves:
                curves.remove(header.group(1))
                code = [header.group(0)]
                while True:
                    loc = f.tell()
                    st = tuple(statement(parser))
                    if not st or st[0] in COMMANDS:
                        f.seek(loc)
                        break
                    code.append(" ".join(st) + ";")
                yield "\n".join(code)

def load_anim(curves):
    tmp = tempfile.mkdtemp(dir=os.path.expanduser("~/"))
    try:
        tmpfile = os.path.join(tmp, "curves.ma")
        data = "//Maya ASCII\nrequires maya \"%s\";\n%s" % (cmds.about(v=True), "\n".join(curves))
        with open(tmpfile, "w") as f: f.write(data)
        nodes = cmds.file(tmpfile, i=True, rnn=True, ns="TMP")
        try:
            for node in cmds.ls(nodes, type="animCurve"):
                yield node
        finally:
            cmds.delete(nodes)
    finally:
        shutil.rmtree(tmp)

def main(path=None, editor="graphEditor1GraphEd"):
    selection = {a: cmds.keyframe(a, q=True, sl=True, iv=True) or [] for a in cmds.animCurveEditor(editor, q=True, cs=True) or []} if cmds.animCurveEditor(editor, ex=True) else []
    if not selection:
        raise RuntimeError("Please select some curves in the graph editor.")
    if path is None:
        path = cmds.fileDialog2(ff="Maya ASCII (*.ma)", fm=1)
        path = path[0] if path else ""
    if not path:
        raise RuntimeError("Please specify an .ma file to load from.")
    cmds.animCurveEditor(editor, e=True, sb="on")
    sel_obj = cmds.ls(sl=True)
    try:
        anim = get_anim(path, selection)
        missing = selection.keys()
        for node in load_anim(anim):
            name = node.rsplit(":", -1)[-1]
            cmds.bufferCurve(name, ov=True)
            cmds.copyKey(node, cb="api")
            cmds.pasteKey(name, o="replaceCompletely", cb="api")
            cmds.bufferCurve(name, sw=True)
            missing.remove(name)
        if missing: cmds.warning("Some curves were not present in file. %s" % missing)
    finally:
        cmds.select(sel_obj)
        for curve, index in selection.items():
            for i in index: cmds.selectKey(curve, index=(i,), add=True)
main("replace with path to file")
{% endhighlight %}
