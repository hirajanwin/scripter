import { isMac } from "./util"

interface ExampleScript {
	guid :string
	name :string
	code :string
}

function s(guid :string, name :string, code :string) :ExampleScript {
	return {
		guid: "examples/" + guid,
		name,
		code: code.replace(/^\s*\n|\n\s*$/, "") + "\n",
	}
}

function kb(mac :string, other :string) {
	return isMac ? mac : other
}

export default (samples => {
	let categories :{[k:string]:ExampleScript[]} = {}
	for (let s of samples) {
		let [category, title] = s.name.split("/", 2)
		if (!title) {
			title = category
			category = ""
		} else {
			s.name = title
		}
		let ss = categories[category]
		if (ss) {
			ss.push(s)
		} else {
			categories[category] = [ s ]
		}
	}
	return categories
})([


s("intro", "Introduction", `
/**
Hello hi and welcome to Scripter.

Scripts are written in relaxed TypeScript.
This grey text here is a comment.

Try running this script using the ► button in the toolbar, or by pressing ${kb("⌘↩︎", "Ctrl+Return")}
*/
print(\`Today is \${Date()}\`)
print("Your viewport:", viewport.bounds)

/**
There are more examples in the menu ☰.
Open the menu using the ☰ button in the bottom left corner.
Create a new script using the + button in the top toolbar.

This editor provides automatic completions of all available functionality, including the Figma API.
Type "figma." to start exploring the API.

Scripts are automatically saved locally and securely.
You can also load and save scripts to the current Figma file.
To save a script, press the "Save to Figma File" button in the toolbar.
Changes to the script are not automatically saved both to the Figma file
as well as locally to your computer.
To remove a script from a Figma file, simply delete the frame in the Figma file's page.
To share a script with someone else, save it to a Figma file and invite others to the file.
To load a script from a Figma file, select the script's frame in Figma and then start Scripter.

Editor basics
• Scripts are automatically saved locally
• Scripts can optionally by saved to the Figma file
• Manage your scripts in the menu.
• Double-click a script in the menu to rename,
  pressing RETURN to commit a name change or
  ESC to cancel.
• Rename a script "" (nothing) to delete it.

Keyboard shortcuts
	Runs the current script                ${kb("⌘↩",    "Ctrl+Return")}
	Stop a running script                  ${kb("⇧⌘↩",  "Ctrl+Shift+Return")}
	Closes Scripter                        ${kb("⌥⌘P",   "Ctrl+Alt+P")}
	Toggle the menu                        ${kb("⌃M",     "Ctrl+M")}
	Increases text size                    ${kb("⌘+",     "Ctrl+Plus")}
	Decreases text size                    ${kb("⌘−",     "Ctrl+Minus")}
	Resets text size                       ${kb("⌘0",     "Ctrl+0")}
	Opens quick commander                  ${kb("F1 ",     "F1")} or ${kb(" ⇧⌘P", "Ctrl+Shift+P")}
	Goes to defintion of selected symbol   ${kb("⌘F12 ",  "Ctrl+F12")} or ${kb(" F12", "F12")}
	Peek definitions of selected symbol    F11
	Show references to selected symbol     ${kb("⇧F12",   "Shift+F12")}
	Quick navigator                        ${kb("⇧⌘O ",   "Ctrl+Shift+O")} or ${kb(" ⌘P", "Ctrl+P")}
	Go back in history                     ${kb("⇧⌘[ ",  "Ctrl+Shift+[")} or ${kb(" ⌃-", "Alt+←")}
	Go forward in history                  ${kb("⇧⌘] ",  "Ctrl+Shift+]")} or ${kb(" ⌃⇧-",   "Alt+→")}

*/
`),


//------------------------------------------------------------------------------------------------


s("figma/rects", "Figma/Create rectangles", `
// Create some rectangles on the current page
let rectangles = range(0, 5).map(i =>
	Rectangle({ x: i * 150, fills: [ ORANGE.paint ] }))

// select our new rectangles and center the viewport
viewport.scrollAndZoomIntoView(setSelection(rectangles))
`),


s("figma/trim-ws", "Figma/Trim whitespace", `
// Select some text and run this script to trim away linebreaks and space.
for (let n of selection()) {
	if (isText(n)) {
		n.characters = n.characters.trim()
	}
}
`),


s("figma/trim-line-indent", "Figma/Trim line indentation", `
// Select some text and run this script to trim away whitespace from the beginning of lines
for (let n of selection()) {
	if (isText(n)) {
		n.characters = n.characters.replace(/\\n\\s+/g, "\\n")
	}
}
`),


s("figma/select-all-images", "Figma/Select all images", `
let images = await find(n => isImage(n) && n)
setSelection(images)

// More node type filters:
//   isDocument, isPage
//   isFrame, isGroup, isSlice
//   isRect, isRectangle
//   isLine
//   isEllipse, isPolygon, isStar
//   isVector
//   isText
//   isBooleanOperation
//   isComponent, isInstance
//   isSceneNode, isContainerNode, isShape
//
// These can also be used as type guards:
//
let n = selection(0)
// here, n's type is the generic BaseNode
if (isRect(n)) {
	// but here n's type is RectangleNode
}
`),


s("figma/set-images-fit", "Figma/Set images to fit", `
// Loop over images in the selection
for (let shape of await find(selection(), n => isImage(n) && n)) {
	// Update image paints to use "FIT" scale mode
	shape.fills = shape.fills.map(p =>
		isImage(p) ? {...p, scaleMode: "FIT"} : p)
}
`),


//------------------------------------------------------------------------------------------------


s("basics/paths", "Basics/Working with paths", `
// The Path library provides functions for working
// with pathnames.
let path = "/foo/bar/baz.png"
print(Path.ext(path))
print(Path.dir(path))
print(Path.base(path))
print(Path.clean("a/c//b/../k"))
print(Path.isAbs(path))
print(Path.join("foo", "//bar/", "baz", "internet"))
print(Path.split(path))
`),


s("basics/files", "Basics/Working with files", `
// Scripter doesn't support interfacing with your file system,
// but it does provide functions for working with file data.

// fileType can be used to investigate what type of file a
// filename represents:
print(fileType("foo/bar.zip"))

// fileType can even guess the file type based on the first
// few bytes of some file data:
print(fileType([0xFF, 0xD8, 0xFF])) // JPEG image data
`),


s("basics/images", "Basics/Showing images", `
// The Img function and class can be used to describe images
// and load image data for a few common image types.
// Passing an Img to print vizualizes the image.

// Img can take a URL which is then loaded by the web browser
print(Img("https://scripter.rsms.me/icon.png"))

// We can specify the size if we want
print(Img("https://scripter.rsms.me/icon.png", {width:128, height:16}))

// Img.load() allows us to load the image data
let icon = await Img("https://scripter.rsms.me/icon.png").load()
print(icon.data)
// A loaded image may also have information that was read from
// the image data itself, like mime type and bitmap dimensions:
print(icon, icon.type, icon.meta)

// fetchImg is a shorthand function for loading an Img
let loadedIcon = await fetchImg("https://scripter.rsms.me/icon.png")
print(loadedIcon, loadedIcon.meta)

// Img also accepts image data as its input,
// in common image formats like png, gif and jpeg.
let gifData = Bytes(\`
	47 49 46 38 39 61
	0A 00 0A 00 91 00 00
	FF FF FF FF 00 00 00 00 FF 00 00 00
	21 F9 04 00 00 00 00 00
	2C 00 00 00 00 0A 00 0A 00 00
	02 16 8C 2D 99 87 2A 1C DC 33 A0 02 75
	EC 95 FA A8 DE 60 8C 04 91 4C 01 00
	3B
\`)
print(Img(gifData, 32))

// Img also supports JPEG in addition to PNG and GIF
let im1 = Img("https://scripter.rsms.me/sample/colors.jpg")
await im1.load()
print(im1, [im1])
`),


s("basics/timers", "Basics/Timers", `
// Timers allows waiting for some time to pass
// or to execute some code after a delay.
await timer(200)
print("200ms passed")

// Timers are promises with a cancel() function
let t = timer(200)
print("timer started")
// cancel the timer before it expires.
// Comment this line out to see the effect.
t.cancel()
// wait for timer
try {
	await t
	print("Rrrriiiiing!")
} catch (_) {
	print("timer canceled")
}

// Timers accept an optional handler function:
timer(200, canceled => {
	print("timer expired.", {canceled})
})
// .cancel() // uncomment to try canceling
`),



s("basics/range", "Basics/Ranges", `
// The range() function creates a sequence of numbers in the
// range [start–end), incrementing in steps. Steps defaults to 1.
print(range(1, 10))
print(range(1, 10, 3))
print(range(100, 0, 20))

// Ranges are iterable
for (let n of range(1,4)) {
	print(n) ; await timer(200)
}

// If we want a pre-allocated array, we can call the array() function
print(range(10).array())
// or use Array.from, since ranges are iterables
print(Array.from(range(1, 10)))

// range is often useful for graphics. We can represent columns or
// rows similar to the Layout Grids feature in Figma:
let columns = range(80, 512, 64)
print(\`64dp wide columns with 80dp offset: \${columns}\`)

// range() returns a LazySeq, which has several functions commonly
// found for Array, like for instance map():
print(range(-4, 4).map(v => \`0x\${(v*10).toString(16)}\`))

// Since the sequence created by range() is lazy, values are allocated
// only as needed, making range() feasible to represent very large
// imaginary ranges.
// For instance, the following only uses very little memory:
print(range(0, 90000000, 2).at(1234567))

// We can even use Inifite to descrive never-ending sequences.
print(range(0, Infinity, 3).at(1234567918383))
// Be careful when iterating over an infinite sequence since it's easy
// to lock Figma if you forget to explicitly stop iteration.
// Scripter will do its best to stop you from doing this: passing an
// infinite sequence to print() or calling toString() on the sequence
// will only show the first 50 entries followed by "... ∞" to indicate
// that it goes on forever:
print(range(0, Infinity, 3))

// Calling functions which only makes sense on finite sequences—like
// map(), array() or join()—on an infinite sequence throws an error:
try {
	range(0, Infinity).array()
} catch (e) {
	print(e)
}
`),



s("basics/jsx", "Basics/JSX", `
/**
 * Scripter supports JSX for creating nodes.
 * JSX tags map 1:1 to Scripter's node constructor functions,
 * like for instance Rectangle() and Frame().
 **/

<Rectangle fills={[ RED.paint ]} />

/**
 * You may notice that the above line does not actually add a
 * rectangle to the current page. This is an intentional
 * difference between the regular constructor form:
 *   Rectangle(...)
 * and the JSX form:
 *   <Rectangle ... />
 * The regular constructor form adds the object to the current
 * page automatically, while the JSX form does not add the node
 * to the page on creation. Instead you call appendChild or
 * addToScene explicitly.
 **/

let frame :FrameNode =
<Frame height={130} fills={[ WHITE.paint ]}>
	<Rectangle fills={[ RED.paint ]} />
	<Text characters="Hello" x={8} y={110} />
</Frame>

// Try uncommenting this to see the frame added to the page
// addToPage(frame)

// Here is an example of using the regular node constructors:
let g = Group(
	Rectangle(),
	Text({characters:"Hello", y:110}),
)

// remove the group since the regular constructor form automatically
// adds nodes to the current page.
g.remove()
`),


//------------------------------------------------------------------------------------------------


s("ui/dialogs", "UI input/Dialogs & Messaging", `
const { notify } = libui

// alert(message) shows a message dialog.
// Blocks the UI. Useful for important messages.
alert("Something very important")

// confirm(question) asks the user a yes or no
// question via a message dialog. Blocks the UI.
// Returns true if the user answered "yes".
print(await confirm("Would you like a kitten?"))

// notify(message, options?) shows a message in
// the bottom of the user's screen.
// Does not block the UI.
notify("Notification", { timeout: 2000 })
`),



s("ui/range-slider", "UI input/Range sliders", `
// Example of using interactive range slider to move a rectangle
const { rangeInput } = libui

// Save viewport and create a red rectangle
let origViewport = { zoom: viewport.zoom, center: viewport.center }
let r = addToPage(Rectangle({ fills: [ORANGE.paint], cornerRadius: 10 }))
try {
	// Set viewport to focus on the rectangle
	viewport.zoom = 1
	viewport.center = {y: r.y, x: r.x}

	// Show a slider and move rectangle as it changes
	for await (let v of rangeInput({min:-300, max:300})) {
		r.x = Math.sin(v * 0.03) * 200
		r.y = Math.cos(v * 0.05) * 80
	}
} finally {
	// Remove the rectangle and restore viewport
	r.remove()
	viewport.center = origViewport.center
	viewport.zoom = origViewport.zoom
}
`),


s("ui/async-gen", "UI input/Async generators", `
// Async generator functions allows creation of iterators which
// may take some amount of time to produce their results.
//
// In this example we use a range input control to generate lists
// of strings upon user moving the slider
async function* meowGenerator(max :number) {
	for await (let count of libui.rangeInput({max, value:1, step:1})) {
		yield range(0, count).map(() => "Meow")
	}
}

// We can now use our meow generator like this:
for await (const meows of meowGenerator(10)) {
	print(meows)
}
`),


//------------------------------------------------------------------------------------------------


s("http/fetch", "HTTP/Fetch", `
// fetch can be used to fetch resources across the interwebs.
// It's the standard fetch API you might already be used to.
let r = await fetch("https://jsonplaceholder.typicode.com/users/1")
print(await r.json())

// Scripter provides a few shorthand functions for common tasks:
print(await fetchJson("https://jsonplaceholder.typicode.com/users/1"))
print(await fetchText("https://jsonplaceholder.typicode.com/users/1"))
print(await fetchImg("https://scripter.rsms.me/icon.png"))
print(await fetchData("https://scripter.rsms.me/icon.png"))
`),


s("http/figma", "HTTP/Figma API", `
// This script demonstrates accessing the Figma HTTP API
//
// First, generate an access token for yourself using the
// "+ Get personal access token" function on this page:
// https://www.figma.com/developers/api#access-tokens
const figmaHttpApiToken = "your_access_token_here"

// We can now fetch JSON representations of files via the HTTP API
let file = await fetchFigmaFile("jahkK3lhzuegZBQXz5BbL7")
print(Img(file.thumbnailUrl), file)

// Simple helper function for GETing files from Figma servers
async function fetchFigmaFile(fileKey :string) :Promise<any> {
	let json = await fetchJson(
		"https://api.figma.com/v1/files/" + encodeURIComponent(fileKey),
		{ headers: { "X-FIGMA-TOKEN": figmaHttpApiToken } }
	)
	if (json.status && json.err) {
		throw new Error(\`API error: \${json.err}\`)
	}
	return json
}
`),


//------------------------------------------------------------------------------------------------


s("worker/basics", "Workers/Worker Basics", `
/**
Workers are new in Scripter since July 2020. Workers is a way to execute code in parallel inside a full WebWorker environment, with access to features like script loading and OffscreenCanvas. There are also iframe-based workers as an option when you need a full complete web DOM with access to the full Web API.

Let's get started with a simple worker:
*/

let w = createWorker(async w => {
  let r = await w.recv()  // wait for input
  let result = "Hello ".repeat(r).trim()  // compute some stuff
  w.send(result)  // send the result
  w.close()  // close the worker
})
w.send(4)  // send some input
print(await w.recv())  // wait for a reply

/**
The above worker is written in idiomatic Scripter style using send() and recv() calls.

If that's not your jam, you can alternatively use the event-based WebWorker API. The following example also shows how you can pass a worker script as a string:
*/

let w2 = createWorker(\`w => {
  w.onmessage = ev => {
    let result = "Bye ".repeat(ev.data).trim()
    w.postMessage(result)
    w.close()
  }
}\`)
w2.postMessage(4)
w2.onmessage = ev => {
  print(ev.data)
}
// We must await the worker or it will be closed immediately
// as the script ends.
await w2

/**
Since Scripter is fully async-await capable, it's usually easier to use the send() and recv() functions instead of postMessage & onmessage events.

send() and recv() are optionally typed, which can be useful when you are writing more complicated scripts or simply prefer to have stricter types:
*/
let w3 = createWorker(async w => {
  let r = await w.recv<number>()  // r is a number
  let result = "Hej ".repeat(r).trim()
  w.send(result)  // type inferred from result
  w.close()
})
w3.send<number>(4)  // this call now only accepts numbers
print(await w3.recv<string>())

/**
One final example: worker requests
The request-response patterns is common with many worker uses and so there is a function-and-event pair to save you time from managing your own request IDs over send & recv:
*/

let w4 = createWorker(async w => {
  w.onrequest = req => {
    return "Hi ".repeat(req.data).trim()  // compute some stuff
  }
})
const r1 = w4.request(/* input: */ 4, /* timeout: */ 1000)
const r2 = w4.request(/* input: */ 9, /* timeout: */ 1000)
print(await r1)
print(await r2)
`),



s("worker/import", "Workers/Importing libraries", `
/**
Workers can import scripts from the Internet and NPM, using w.import().
This opens up a world of millions of JavaScript libraries to Scripter!
Browse libraries at https://www.npmjs.com/

Let's import the lru_map package:
*/
let w = createWorker(async w => {
	let { LRUMap } = await w.import("lru_map")
	let c = new LRUMap(3)
	c.set('sam', 42)
	c.set('john', 26)
	c.set('angela', 24)
	w.send(c.toString())
	c.get('john') // touch entry to make it "recently used"
	w.send(c.toString())
})
print(await w.recv())
print(await w.recv())

/**
You can import any URL; you are not limited to NPM. Additionally, using the importAll function we can import multiple packages at once:
*/
w = createWorker(async w => {
	let [{ LRUMap }, d3] = await w.importAll(
		"https://unpkg.com/lru_map@0.4.0/dist/lru.js",
		"d3@5",
	)
	w.send(\`d3: \${typeof d3}, LRUMap: \${typeof LRUMap}\`)
})
print(await w.recv())

// Note that TypeScript types are not supported for imported modules.
// Scripter considers the API exposed by an imported library as "any".
`),



s("worker/iframe-d3-density-contours", "Workers/IFrame workers", `
/**
Sometimes a worker needs a full Web DOM or access to a Web API only available in full-blown documents, like WebGL. That's when iframe-based workers comes in handy.

This example shows how to load an external library which manipulates SVG in a DOM to create complex graphs. Specifically, the chart generated shows the relationship between idle and eruption times for Old Faithful. (Source: https://observablehq.com/@d3/density-contours)
*/

let w = createWorker({iframe:true}, async w => {
  // load d3 library
  const d3 = await w.import("d3@5")

  // load dataset and add labels to the array
  const data = Object.assign(
    await w.recv<{x:number,y:number}[]>(),
    {x: "Idle (min.)", y: "Erupting (min.)"}
  )

  const width = 800
  const height = 800
  const margin = {top: 20, right: 30, bottom: 30, left: 40}

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .rangeRound([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .rangeRound([height - margin.bottom, margin.top])

  const xAxis = g => g.append("g")
    .attr("transform", \`translate(0,\${height - margin.bottom})\`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("y", -3)
      .attr("dy", null)
      .attr("font-weight", "bold")
      .text(data.x))

  const yAxis = g => g.append("g")
    .attr("transform", \`translate(\${margin.left},0)\`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  const contours = d3.contourDensity()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .size([width, height])
    .bandwidth(30)
    .thresholds(30)
    (data)

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(contours)
    .enter().append("path")
      .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
      .attr("d", d3.geoPath());

  svg.append("g")
      .attr("stroke", "white")
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 2);

  // respond with SVG code
  w.send(svg.node().outerHTML)
})

// load sample data
const data = await fetchJson("https://scripter.rsms.me/sample/old-faithful.json")

// Send data to the worker for processing.
// The second argument causes data to be transferred
// instead of copied.
w.send(data, [data])

// await a response, then add SVG to Figma document
let svg = await w.recv<string>()
let n = figma.createNodeFromSvg(svg)
figma.viewport.scrollAndZoomIntoView([n])
`),


s("worker/window-basics", "Workers/Windows", `
/**
Workers backed by an iframe can be made visible and interactive via the "visible" property passed to createWorker.
*/
const w1 = createWorker({iframe:{visible:true,width:100}}, async w => {
	w.document.body.innerHTML = \`<p>Hello</p>\`
})

/**
createWindow is a dedicated function for creating windows that house workers. To explore the options and the API, either place your pointer over createWindow below and press F12 or ALT-click the createWindow call to jump to the API documentation.
*/
const w2 = createWindow({width:300,height:100}, async w => {
	let time :any
	const ui = w.createElement("div", {
		style: {
			display: "flex",
			"flex-direction": "column",
			font: "12px sans-serif",
		}},
		w.createElement("button", { onclick() { w.send("ping") } }, "Ping!"),
		w.createElement("button", { onclick() { w.close() } }, "Close window"),
		time = w.createElement("p", {}, "")
	)
	w.document.body.appendChild(ui)

	function updateTime() {
		time.innerText = \`Time: \${(new Date).toTimeString()}\`
	}
	updateTime()
	setInterval(updateTime, 1000)
})

w2.onmessage = ev => {
	// click the "Ping!" button in the window
	print(ev.data)
}

// wait until both windows have been closed
await Promise.all([w1,w2])
`),


s("worker/window-advanced1", "Workers/Windows advanced", `
/**
This is a version of the "IFrame worker" example which uses the d3 library inside a window to create a data visualization. However, instead of adding the generating graph to the Figma document, its shown in an interactive window instead. (Source: https://observablehq.com/@d3/density-contours)

A second window is opened as well, loading a Three.js WebGL via an external URL.
*/
const w1 = createWindow({title:"d3",width:800}, async w => {
  // load data
  const datap = fetch("https://scripter.rsms.me/sample/old-faithful.json").then(r => r.json())

  // load d3 library
  const d3 = await w.import("d3@5")

  // wait for dataset and add labels
  const data = Object.assign(
    await datap,
    {x: "Idle (min.)", y: "Erupting (min.)"}
  )

  const width = 800
  const height = 800
  const margin = {top: 20, right: 30, bottom: 30, left: 40}

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.x)).nice()
    .rangeRound([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.y)).nice()
    .rangeRound([height - margin.bottom, margin.top])

  const xAxis = g => g.append("g")
    .attr("transform", \`translate(0,\${height - margin.bottom})\`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("y", -3)
      .attr("dy", null)
      .attr("font-weight", "bold")
      .text(data.x))

  const yAxis = g => g.append("g")
    .attr("transform", \`translate(\${margin.left},0)\`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  const contours = d3.contourDensity()
    .x(d => x(d.x))
    .y(d => y(d.y))
    .size([width, height])
    .bandwidth(30)
    .thresholds(30)
    (data)

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(contours)
    .enter().append("path")
      .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
      .attr("d", d3.geoPath());

  svg.append("g")
      .attr("stroke", "white")
    .selectAll("circle")
    .data(data)
    .enter().append("circle")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", 2);

  // respond with SVG code
  w.document.body.appendChild(svg.node())
})

const w2 = createWindow(
  {title:"Three.js"},
  "https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html")

// wait until both windows have been closed
await Promise.all([w1,w2])
`),


//------------------------------------------------------------------------------------------------


s("advanced/timeout", "Advanced/Timeout", `
// Example of using withTimeout for limiting the time
// of a long-running process.

// Try changing the delay here from 200 to 300:
await doSlowThing(200)
async function doSlowThing(timeout :number) {
	let result = await withTimeout(getFromSlowInternet(), timeout)
	if (result == "TIMEOUT") {
		print("network request timed out :-(")
	} else {
		print("network request finished on time :-)", result)
	}
}

// Function that simulates a slow, cancellable network fetch.
// In parctice, this would be some some actual long-running thing
// like fetch call or timer.
function getFromSlowInternet() :CancellablePromise<Object> {
	return timer(250).catch(_=>{}).then(() => ({message: "Hello"}))
}
`),


s("advanced/tick-tock", "Advanced/Tick tock, tick tock, tick tock", `
// Demonstrates continously-running scripts.
// This loops forever until you restart or
// stop the script.

for (let i = 1; true; i++) {
	print(i % 2 ? "Tick" : "Tock")
	await timer(1000)  // wait for 1 second
}
`),


s("advanced/animation", "Advanced/Animation", `
// Example of using animate()
// Moves a rectangle around in a "figure eight" pattern.
let r = addToPage(Rectangle({ fills:[ORANGE.paint], rotation: 45 }))
try {
	// setup viewport
	viewport.scrollAndZoomIntoView([r])
	viewport.zoom = 1

	// extent of motion in dp
	const size = 500 - r.width

	// animation loop
	await animate(time => {
		// This function is called at a high frequency with
		// time incrementing for every call.
		time *= 3 // speed things up
		let scale = size / (3 - Math.cos(time * 2))
		r.x = scale * Math.cos(time) - (r.width / 2)
		r.y = scale * Math.sin(2 * time) / 2 - (r.height / 2)
	})
} finally {
	// When the script is stopped, remove the rectangle
	r.remove()
}
`),


] as ExampleScript[])
