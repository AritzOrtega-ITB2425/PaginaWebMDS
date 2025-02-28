document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadSection = document.getElementById('uploadSection');
    const consumptionSection = document.getElementById('consumptionSection');
    const consumptionButtons = document.querySelectorAll('.consumption-type .btn');
    const unitElements = document.querySelectorAll('.unit');

    // Variables para almacenar datos
    let consumptionData = null;

    // Eventos para drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Manejar la carga del archivo
    function handleFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                if (file.name.endsWith('.csv')) {
                    consumptionData = parseCSV(e.target.result);
                } else if (file.name.endsWith('.json')) {
                    consumptionData = JSON.parse(e.target.result);
                }
                showConsumptionData('energy'); // Mostrar datos energéticos por defecto
                uploadSection.classList.remove('active');
                uploadSection.classList.add('hidden');
                consumptionSection.classList.remove('hidden');
                consumptionSection.classList.add('active');
            } catch (error) {
                alert('Error al procesar el archivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Cambiar entre tipos de consumo
    consumptionButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            consumptionButtons.forEach(btn => btn.classList.remove('active'));
            // Añadir clase active al botón clickeado
            button.classList.add('active');

            // Actualizar la visualización
            const type = button.dataset.type;
            const unit = button.dataset.unit;

            // Actualizar todas las unidades en la página
            unitElements.forEach(element => {
                element.textContent = unit;
            });

            // Mostrar los datos correspondientes
            if (consumptionData) {
                showConsumptionData(type);
            }
        });
    });

    // Función para mostrar los datos según el tipo seleccionado
    function showConsumptionData(type) {
        // Aquí implementarías la lógica para mostrar los datos
        // según el tipo de consumo seleccionado (energético, hidráulico o monetario)
        // Por ahora solo actualizamos las unidades
        const units = {
            'energy': 'kWh',
            'water': 'L',
            'money': '€'
        };

        unitElements.forEach(element => {
            element.textContent = units[type];
        });
    }

    // Función para parsear CSV (implementación básica)
    function parseCSV(csv) {
        // Aquí implementarías la lógica para parsear el CSV
        // Esta es una implementación muy básica
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header.trim()] = values[index].trim();
                });
                data.push(row);
            }
        }

        return data;
    }
});