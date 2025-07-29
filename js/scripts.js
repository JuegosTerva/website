/*!
* Start Bootstrap - Modern Business v5.0.5 (https://startbootstrap.com/template-overviews/modern-business)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

    const params = new URLSearchParams(window.location.search);
    const archivo = params.get("archivo");
    const rutaIndice = "mdVisor.html?archivo=index.md";

    function agregarBotonesCopiar() {
      const bloques = document.querySelectorAll("pre > code");

      bloques.forEach(bloque => {
        hljs.highlightElement(bloque);

        const pre = bloque.parentElement;
        const boton = document.createElement("button");
        boton.className = "copy-btn";
        boton.textContent = "Copiar";
        boton.addEventListener("click", () => {
          navigator.clipboard.writeText(bloque.textContent).then(() => {
            boton.textContent = "¡Copiado!";
            setTimeout(() => boton.textContent = "Copiar", 2000);
          });
        });
        pre.appendChild(boton);
      });
    }

    function mostrarEnlaceVolver() {
      if (archivo && archivo !== rutaIndice) {
        const nav = document.getElementById("nav");
        nav.innerHTML = `<a href="${rutaIndice}"><i class="bi bi-caret-left-square"></i> Volver al índice</a>`;
      }
    }


    if (archivo) {
      fetch(archivo)
        .then(res => {
          if (!res.ok) throw new Error("No se pudo cargar el archivo");
          return res.text();
        })
        .then(texto => {
          const md = window.markdownit({
            html: true,
            linkify: true,
            typographer: true
          }).use(window.markdownitFootnote);

          const html = md.render(texto);
          const contenedor = document.getElementById("markdown");
          contenedor.innerHTML = html;

        // 🔗 Ajustar enlaces internos (a .md) para que sigan usando el visor
          contenedor.querySelectorAll("a").forEach(enlace => {
            const href = enlace.getAttribute("href");
            if (href && href.endsWith(".md") && !href.startsWith("http") && !href.startsWith("#")) {
              enlace.setAttribute("href", `mdVisor.html?archivo=${href}`);
            }
          });

          agregarBotonesCopiar();
          mostrarEnlaceVolver();
        })

        .catch(error => {
          document.getElementById("markdown").innerHTML = `
            <div class="markdown-body">
              <p style="color: #b00020; background-color: #ffe6e6; padding: 1rem; border-radius: 8px;">
                <strong>Error:</strong> No se pudo cargar el archivo Markdown.
              </p>
              <p>Si crees que esto es un error, por favor <a href="mailto:juegoterva@gmail.com">escríbeme a juegoterva@gmail.com</a>.</p>
              <p>Puedes ver mas tutoriales en <a href="mdVisor.html?archivo=index.md">el índice de contenidos</a>. </p>
            </div>
  `;
  console.error(error);
});
    } else {
      document.getElementById("markdown").innerHTML = "<p>No se especificó ningún archivo Markdown.</p>";
    }