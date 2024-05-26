let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage);

    document.getElementById('page1').addEventListener('click', () => {
        nextPage();
    });

    document.querySelectorAll('#page2 p').forEach(el => {
        el.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            await sendData(id);
            nextPage();
        });
    });

    document.getElementById('page3').addEventListener('click', () => {
        currentPage = 1;
        resetPage();
        showPage(currentPage);
    });
});

function showPage(page) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page${page}`).classList.add('active');

    if (page === 1) {
        setTimeout(() => {
            document.querySelector('#page1 .fade-in').classList.add('show');
        }, 100); // フェードインの遅延を追加
    } else if (page === 2) {
        document.querySelectorAll('#page2 .fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('show');
            }, 1000 * (index + 1));
        });
    } else if (page === 3) {
        drawChart();
    }
}

async function sendData(id) {
    const response = await fetch('/update_count', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
    const result = await response.json();
    return result;
}

function nextPage() {
    currentPage++;
    if (currentPage > 3) currentPage = 1;
    showPage(currentPage);
}

function resetPage() {
    // フェードインのリセット
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.remove('show');
        el.style.opacity = 0;
    });
}

async function drawChart() {
    const response = await fetch('/get_counts');
    const counts = await response.json();

    const ctx = document.getElementById('chartCanvas').getContext('2d');
    const data = {
        labels: ['調和だ', '闘争だ', '真だ', '無だ'],
        datasets: [{
            label: '選択数',
            data: [counts.text1, counts.text2, counts.text3, counts.text4],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
    };
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}