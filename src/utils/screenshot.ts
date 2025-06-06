// 指定区域截图
export const captureScreenshot = async (area: SVGElement) => {
  // 获取 area 的边界框
  // @ts-ignore
  const bbox = area.getBBox();

  // 创建一个新的 SVG 元素
  const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  newSvg.setAttribute("width", bbox.width.toString());
  newSvg.setAttribute("height", bbox.height.toString());
  newSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

  // 克隆 area 内容并添加到新的 SVG 中
  const clonedContent = area.cloneNode(true) as SVGElement;

  // 修复 image 标签的 href 属性，确保内容被直接包含在截图生成的 SVG 中
  const images = clonedContent.querySelectorAll("image");
  await Promise.all(
    Array.from(images).map(async (img) => {
      const href = img.getAttribute("href");
      if (href && href.endsWith(".svg")) {
        const svgContent = await fetch(href).then((res) => res.text());
        img.setAttribute("href", `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`);
      }
    })
  );

  newSvg.appendChild(clonedContent);

  // 将样式内联到克隆的 SVG 内容中
  const styleSheets = Array.from(document.styleSheets);
  const cssText = styleSheets
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("");
      } catch (e) {
        return "";
      }
    })
    .join("");
  const style = document.createElement("style");
  style.textContent = cssText;
  newSvg.insertBefore(style, newSvg.firstChild);

  // 将新的 SVG 转换为 base64 编码的图片
  const svgData = new XMLSerializer().serializeToString(newSvg);
  const svgBase64 = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;

  const img = new Image();
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = svgBase64;
  });

  const canvas = document.createElement("canvas");
  canvas.width = bbox.width;
  canvas.height = bbox.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
    const pngUrl = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.download = "field-screenshot.png";
    link.href = pngUrl;
    link.click();
  }
};
