import os
from flask import Flask, request, render_template
import urllib2
import simplejson
from werkzeug.contrib.cache import SimpleCache

cache = SimpleCache()

app = Flask(__name__)

@app.route('/')
def index():

    if app.debug:
        ip = "62.16.197.37"
    else:
        ip = request.remote_addr
    pos = None
    try:
        f = urllib2.urlopen('http://freegeoip.net/json/' + ip)
        res = f.read()
        data = simplejson.loads(res)
        if data["country_code"] != "RD":
            pos = {"lon": data["longitude"], "lat": data["latitude"]}

    except urllib2.HTTPError:
        pass
    return render_template('index.html', pos=pos)

@app.route('/books')
def books():

    rv = cache.get('books2')
    if rv is None:
        rv = get_books()
        cache.set('books2', rv, timeout=10 * 60)
    return rv

def get_books():
    url = 'http://www.librarything.com/api/json_books.php?userid=atlefren&resultsets=books,bookdates,bookratings&limit=bookswithstartorfinishdates&max=1000&key=2067197567'
    f = urllib2.urlopen(url)
    page = f.read()
    lines = page.split('\n')

    matching = [s for s in lines if "var widgetResults =" in s]
    if matching:
        return matching[0][20:-1]

@app.route('/code')
def code():

    rv = cache.get('code')
    if rv is None:
        f = urllib2.urlopen("https://api.github.com/users/atlefren/events")
        rv = f.read()
        cache.set('code', rv, timeout=10 * 60)
    return rv

@app.route('/pocket')
def pocket():
    return read_pocket()
    #rv = cache.get('pocket')
    #if rv is None:
    #    rv = read_pocket()
    #    cache.set('pocket', rv, timeout=10 * 60)
    #return rv

def read_pocket():

    url = "https://getpocket.com/v3/get?state=all&sort=newest&detailType=simple&count=5"
    headers = {'consumer_key': '12469-143f1b4e591eba9bfcc3c310', 'access_token': 'atlefren'}
    req = urllib2.Request(url, None, headers)
    f = urllib2.urlopen(req)
    return f.read()

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)