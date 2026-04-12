const fs = require('fs');

let dataContent = fs.readFileSync('data.js', 'utf8');

// The array starts at const carData = [ ... ];
// We can use a regex or just replace the images array logic.
// We'll write a script to evaluate the JS, modify it, and write it back.

const scriptToRun = `
    const fs = require('fs');
    const path = require('path');

    let oldData = fs.readFileSync('data.js', 'utf8');
    
    // Quick regex to modify all images arrays
    let newData = oldData.replace(/"images": \\[[\\s\\S]*?\\]/g, (match, offset, string) => {
        // Find the id of the car we are currently in.
        // Look backwards for "id": X
        let beforeStr = string.substring(0, offset);
        let idMatch = beforeStr.match(/"id":\\s*(\\d+)/g);
        let currentId = 1;
        if (idMatch && idMatch.length > 0) {
            let lastIdStr = idMatch[idMatch.length - 1];
            let numMatch = lastIdStr.match(/\\d+/);
            if (numMatch) currentId = parseInt(numMatch[0]);
        }
        
        return \`"images": [
            "assets/car\${currentId}_img1.jpg",
            "assets/car\${currentId}_img2.jpg",
            "assets/car\${currentId}_img3.jpg",
            "assets/car\${currentId}_img4.jpg"\n        ]\`;
    });

    fs.writeFileSync('data.js', newData, 'utf8');
    console.log("Updated!");
`;

fs.writeFileSync('update_all_images.js', scriptToRun, 'utf8');
