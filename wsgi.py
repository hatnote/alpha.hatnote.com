import os
import sys
import time

from subprocess import Popen, PIPE
from clastic import Application, render_basic
from clastic.meta import MetaApplication

SOURCE_DIR = os.path.dirname(os.path.abspath(__file__))


def publish():
    proc = Popen('git pull', shell=True, cwd=SOURCE_DIR, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    out, err = proc.communicate()
    if err.strip():
        return 'Output:\n\n%s\n\nErrors:\n\n%s' % (out, err)
    return 'Output:\n\n%s' % out


application = Application([('/publish', publish, render_basic),
                           ('/publish/meta', MetaApplication)])


if __name__ == '__main__':
    app.serve()
