/* 
 * ASCIIfy - give it an IMG element and it'll give you ASCII art back as text or HTML
 * Created by Andy Smith - http://twitter.com/asmitter
 * Only really tested in Chromium & Webkit so far, Needs <CANVAS> support, so no IE
 * Distributed under "Do What You Wish", but ping me if you use it for anything cool.
 *
 * @params	{element}	img			DOM node of <img> element
 * @params	{integer}	width		Width of the resulting ASCII image (in characters)
 * @params	{boolean}	doHtml		whether to return HTML or plain text
 * @param	{boolean}	doColour	whether to colourise the output. Only work if doHTML is set to true
 * @return	{string}
 */

function asciify(img, width, doHtml, doColour) {
	var characterSet = ' .:,;+ijtfLGDKW#';
	// var characterSet = '#WKDGLftji+;,:. '; // use inverted set if you're using white text on dark background.

    // Create an empty canvas element
	var canvas = document.createElement('canvas');
    var height = (width / img.width) * img.height;
	canvas.width = width;
    canvas.height = height;

    // Copy the image contents to the canvas at the right size
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
	
	// Get the image data
	var imageData = ctx.getImageData(0, 0, width, height).data;
	
	var pixelArr = [], lineStr, imgStr, y, x;

	for (y = 0; y < height - 1; y++) { // Loop through the lines
		for (x = 0; x < width; x++) { // Loop through the pixels in this line
			// Get red, blue, green & alpha values
			var pixelOffset = (x + y * width) * 4;
			var r = imageData[pixelOffset];
			var g = imageData[pixelOffset+1];
			var b = imageData[pixelOffset+2];
			var a = imageData[pixelOffset+3];
			
			// Use NTSC-based luminosity algorithm
			var greyValue = ((0.2125*r) + (0.7154*g) + (0.0721*b)) / 255;
			// Select which character to use
			var characterIndex = (characterSet.length-1) - Math.round(greyValue * (characterSet.length-1));
			
			// Add the character to the current line based on params. Note: cannot do colour without doing HTML.
			if (doHtml) {
				if (doColour) {
						lineStr += '<span style="color:rgb('+r+','+g+','+b+')">'+(' ' == characterSet[characterIndex] ? '&nbsp;' : characterSet[characterIndex])+'</span>';
					} else {
						lineStr += (' ' == characterSet[characterIndex] ? '&nbsp;' : characterSet[characterIndex]);
					}
			} else {
				lineStr += characterSet[characterIndex];
			}
		}
		// Create line break
		imgStr += lineStr + (doHtml ? "<br>" : "\n");
		// Clear the string
		lineStr = '';
	}
	return imgStr;
}