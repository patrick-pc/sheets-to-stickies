// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Runs this code if the plugin is run in Figma
if (figma.editorType === "figma") {
  // This plugin creates 5 rectangles on the screen.
  const numberOfRectangles = 5;

  const nodes: SceneNode[] = [];
  for (let i = 0; i < numberOfRectangles; i++) {
    const rect = figma.createEllipse();
    rect.x = i * 150;
    rect.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }
  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
}

// Runs this code if the plugin is run in FigJam
if (figma.editorType === "figjam") {
  const maxPerLine = 5;
  const xIncrement = 280;
  const yIncrement = 280;

  (async () => {
    // Load the font before setting characters
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    const data = await fetchSheetData();

    const nodes = data.map((item: string, index: number) => {
      const sticky = figma.createSticky();
      sticky.text.characters = item;

      sticky.x = (index % maxPerLine) * xIncrement;
      sticky.y = Math.floor(index / maxPerLine) * yIncrement;
      sticky.fills = [{ type: "SOLID", color: { r: 1, g: 0.85, b: 0.4 } }];
      sticky.authorVisible = false;

      return sticky;
    });

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    figma.closePlugin();
  })();
}

async function fetchSheetData() {
  const SHEET_ID = "sg3gr3eo8u6nw";

  try {
    const response = await fetch(`https://sheetdb.io/api/v1/${SHEET_ID}`);
    const data = await response.json();

    console.log("@@@ data", data);

    return data.flatMap(
      (obj: {
        Bot1: string;
        Bot2: string;
        Bot3: string;
        Bot4: string;
        Bot5: string;
      }) => [obj["Bot1"], obj["Bot2"], obj["Bot3"], obj["Bot4"], obj["Bot5"]]
    );
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
