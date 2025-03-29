(function () {
  javascript: (function () {
    // Configuração da API atualizada
    const GEMINI_API_KEY = "AIzaSyA2OCjx8Zl5C05Hl_57srvobTM34VdPBxo";
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // Criar interface
    function createUI() {
      // Remover UI existente
      const existingUI = document.getElementById("gemini-helper-container");
      if (existingUI) {
        existingUI.remove();
      }

      // Container principal
      const container = document.createElement("div");
      container.id = "gemini-helper-container";
      container.style.position = "fixed";
      container.style.bottom = "50px";
      container.style.right = "50%";
      container.style.transform = "translateX(50%)";
      container.style.zIndex = "999999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      container.style.alignItems = "center";

      // Botão de ação
      const actionBtn = document.createElement("button");
      actionBtn.id = "gemini-helper-btn";
      actionBtn.textContent = "🔍";
      actionBtn.style.padding = "12px 20px";
      actionBtn.style.backgroundColor = "#1e1e2e";
      actionBtn.style.color = "white";
      actionBtn.style.border = "none";
      actionBtn.style.borderRadius = "24px";
      actionBtn.style.cursor = "pointer";
      actionBtn.style.fontWeight = "bold";
      actionBtn.style.boxShadow = "0 2px 10px rgba(0,0,0,0.5)";

      // Painel de resposta
      const responsePanel = document.createElement("div");
      responsePanel.id = "gemini-response-panel";
      responsePanel.style.display = "none";
      responsePanel.style.background = "#1e1e2e";
      responsePanel.style.borderRadius = "12px";
      responsePanel.style.padding = "15px";
      responsePanel.style.boxShadow = "0 4px 15px rgba(0,0,0,0.5)";
      responsePanel.style.maxWidth = "300px";
      responsePanel.style.color = "white";
      responsePanel.style.textAlign = "center";

      // Montar UI
      container.appendChild(actionBtn);
      container.appendChild(responsePanel);
      document.body.appendChild(container);
      return {
        actionBtn,
        responsePanel
      };
    }

    // Extrair todo o conteúdo textual da página
    function extractPageContent() {
      // Clonar o body para não afetar o DOM original
      const bodyClone = document.cloneNode(true);

      // Remover elementos indesejados
      const unwantedTags = ["script", "style", "noscript", "svg", "iframe", "head"];
      unwantedTags.forEach(tag => {
        bodyClone.querySelectorAll(tag).forEach(el => el.remove());
      });
      return bodyClone.body.textContent.replace(/\s+/g, " ").substring(0, 15000);
    }

    // Analisar com Gemini (usando modelo flash)
    async function analyzeContent(text) {
      const prompt = `Veja esse conteúdo e responda oque pede, me de a resposta direta, sem comentários, conteúdo:\n\n${text}\n\nResposta:`;
      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              maxOutputTokens: 100,
              temperature: 0.2
            }
          })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Resposta não encontrada";
      } catch (error) {
        console.error("Erro na API:", error);
        return "Erro ao analisar";
      }
    }

    // Mostrar resposta
    function showResponse(panel, answer) {
      panel.innerHTML = `
            <div style="padding:12px; backgroundColor: #28283b; color:white; border-radius:6px; text-align:center; font-size:18px;">
                <strong>${answer}</strong>
            </div>
            <button id="close-btn" style="margin-top:12px; padding:8px 16px; border:1px solid white; background:transparent; border-radius:8px; color:white; font-size:14px; cursor:pointer;">Fechar</button>
        `;
      panel.style.display = "block";

      document.getElementById("close-btn").addEventListener("click", () => {
        panel.style.display = "none";
      });
    }

    // Iniciar
    const {
      actionBtn,
      responsePanel
    } = createUI();
    actionBtn.addEventListener("click", async function () {
      actionBtn.disabled = true;
      actionBtn.textContent = "⏳";
      actionBtn.style.opacity = "0.7";
      const pageContent = extractPageContent();
      const answer = await analyzeContent(pageContent);
      showResponse(responsePanel, answer);
      actionBtn.disabled = false;
      actionBtn.textContent = "🔍";
      actionBtn.style.opacity = "1";
    });
  })();
})();
