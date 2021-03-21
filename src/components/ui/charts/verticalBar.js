import React, { useMemo, useState } from 'react'
import { Bar } from '@reactchartjs/react-chart.js'


const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
                callback: function (value) {
                    return `£${value}k`;
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Número de alunos'
                }
            },

        ],
        xAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    // callback: value => `£${formatNumberDecimal(value)}`
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Percentual resolvido (%)'
                }
            }
        ],
    },
}

/**
 * https://reactchartjs.github.io/react-chartjs-2/#/vertical-bar
*/

const VerticalBar = (props) => {
    const data = useMemo(() => {
        return {
            labels: ['0 - 20', '20,01 - 40', '40,01 - 60', '60,01 - 80', '80,01 - 100'],
            datasets: [
                {
                    label: 'Desepenho nas listas',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }
    }, [props]);

    return (
        <Bar data={data} options={options} />
    )
}

export default VerticalBar;
