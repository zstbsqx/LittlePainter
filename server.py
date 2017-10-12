# -*- encoding: utf-8 -*-
import os

from flask import Flask, send_file, send_from_directory

static_dir = os.path.join(os.path.dirname(__file__), 'static')
app = Flask(__name__)


@app.route('/')
def index():
    return send_from_directory(static_dir, 'index.html')

if __name__ == '__main__':
    app.run('0.0.0.0', 8004)
