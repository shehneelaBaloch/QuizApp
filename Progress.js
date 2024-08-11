// Function to go back to the main page
function goBack() {
    window.location.href = 'index.html'; // Adjust to your main page
}

// Function to create the chart
function createProgressChart(progressData) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Remaining'],
            datasets: [{
                label: 'Quiz Progress',
                data: [progressData.score, progressData.totalQuestions - progressData.score],
                backgroundColor: ['#4caf50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const dataset = tooltipItem.dataset;
                            const total = dataset.data.reduce((acc, val) => acc + val, 0);
                            const percentage = (dataset.data[tooltipItem.dataIndex] / total * 100).toFixed(2);
                            return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Load progress data from local storage and create the chart
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve the progress data from local storage
    const progressData = localStorage.getItem('quizProgress');
    
    if (progressData) {
        // Parse the data from local storage
        const progress = JSON.parse(progressData);

        // Create the chart with the retrieved progress data
        createProgressChart(progress);
    } else {
        // Handle case where no progress data is found
        document.querySelector('.progress').innerHTML = "<p>No progress found.</p>";
    }
});
