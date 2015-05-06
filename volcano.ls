require! <[fs request cheerio]>

(e,r,b) <- request {
  url: \http://www.volcano.si.edu/reports_weekly.cfm
  method: \GET
}, _
if e or !b => return
$ = cheerio.load (fs.read-file-sync \output .toString!)
fetch = (list, geojson = {}) ->
  for idx from 0 til list.length
    text = $(list[idx]).text!replace(/&nbsp;/g, '').split("|").map(->it.trim!)
    if !text => continue
    latlng = text.2.split \, .map ->
      ret = /([0-9.]+)°([NWSE])/.exec it
      if !ret => return null
      ret = parseFloat(ret.1) * ( if /[NE]/.exec ret.2 => 1 else -1 )
    ret = /(\d+)/.exec text.3
    if !ret => elevation = null else elevation = parseFloat(ret.1)
    geojson.features.push do
      type: \Feature
      properties: {name: text.0, location: text.1, elevation}
      geometry: {type: \Point, coordinates: [latlng.1, latlng.0]}

geojson = {"type":"FeatureCollection", features:[]}
fetch $(".WeeklyNameNew"), geojson
fetch $(".WeeklyNameOngoing"), geojson

fs.write-file-sync \volcano.json, JSON.stringify(geojson)

