import { staticFile } from 'remotion';

const style = document.createElement('style');
style.textContent = `@font-face {
  font-family: "SF Pro Display";
  src: url('${staticFile("testimonial/SFPRODISPLAYREGULAR.OTF")}') format("opentype");
  font-display: block;
}
@font-face {
  font-family: "SF Pro Display";
  src: url('${staticFile("testimonial/SFPRODISPLAYBOLD.OTF")}') format("opentype");
  font-weight: 700;
  font-display: block;
}
@font-face {
  font-family: "Moonhouse";
  src: url('${staticFile("testimonial/Moonhouse-yE5M.ttf")}') format("truetype");
  font-display: block;
}`;
document.head.appendChild(style);
