
const candidatosApiUrl = 'https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/candidatos.json';
const administradorApiUrl = 'https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/administrador.json';

document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login');
    const adminContainer = document.getElementById('admin');
    const candidatosContainer = document.getElementById('candidatos');
    const resultadoContainer = document.getElementById('resultado');
    const loginButton = document.getElementById('loginButton');
    const iniciarButton = document.getElementById('iniciarButton');
    const cerrarButton = document.getElementById('cerrarButton');

    let candidatos = [];
    let votos = {};

    // Fetch candidatos
    async function fetchCandidatos() {
        const response = await fetch(candidatosApiUrl);
        candidatos = await response.json();
        candidatos.forEach(candidato => {
            votos[candidato.nombre] = 0;
        });
    }

    // Fetch administrador and validate login
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const response = await fetch(administradorApiUrl);
        const administrador = await response.json();
        
        if (username === administrador.username && password === administrador.password) {
            loginContainer.style.display = 'none';
            adminContainer.style.display = 'block';
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    });

    // Handle iniciar votación
    iniciarButton.addEventListener('click', async () => {
        await fetchCandidatos();
        candidatosContainer.style.display = 'block';
        cerrarButton.style.display = 'block';

        candidatosContainer.innerHTML = '';
        candidatos.forEach(candidato => {
            const candidatoElement = document.createElement('div');
            candidatoElement.className = 'candidato';
            candidatoElement.innerHTML = `
                <div>
                    <strong>${candidato.programa}</strong><br>
                    Aprendiz: ${candidato.nombre}<br>
                    Ficha: ${candidato.ficha}
                </div>
                <img src="${candidato.foto}" alt="${candidato.nombre}">
            `;
            candidatoElement.addEventListener('click', () => confirmarVoto(candidato));
            candidatosContainer.appendChild(candidatoElement);
        });
    });

    // Handle votar
    function confirmarVoto(candidato) {
        const confirmar = confirm(`¿Estás seguro de votar por ${candidato.nombre}?`);
        if (confirmar) {
            votos[candidato.nombre]++;
            alert(`Voto registrado para ${candidato.nombre}`);
        }
    }

    // Handle cerrar votación
    cerrarButton.addEventListener('click', () => {
        candidatosContainer.style.display = 'none';
        resultadoContainer.style.display = 'block';
        resultadoContainer.innerHTML = '<h2>Resultados de la Votación</h2>';

        for (const [nombre, voto] of Object.entries(votos)) {
            const resultadoElement = document.createElement('div');
            resultadoElement.className = 'resultado';
            resultadoElement.innerHTML = `
                ${nombre} - Votos: ${voto}
            `;
            resultadoContainer.appendChild(resultadoElement);
        }
    });
});
