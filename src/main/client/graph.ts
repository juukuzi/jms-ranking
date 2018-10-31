import { Chart, ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';
import ExpData from '../datastore/ExpData';

declare const expDataList: ExpData[];

document.addEventListener('DOMContentLoaded', () => {

    if (!expDataList) return;

    const canvas = document.getElementById('graph') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const dateList: string[] = expDataList.map(data => moment(data.date).format('MM/DD'));
    const levelList: (number | undefined)[] = expDataList.map(data => data.level);
    const safeLevelList: number[] = levelList.filter(val => typeof val !== 'undefined') as number[];
    const expList: number[] = expDataList.map(data => ExpData.percentage(data));

    const minLevel = Math.min(...safeLevelList);
    const maxLevel = Math.max(minLevel + 1, ...safeLevelList);

    // レベルのメモリ表示幅を設定
    const diff = maxLevel - minLevel;
    let levelStep = 1;
    if (diff > 100) {
        levelStep = 20;
    } if (diff > 50) {
        levelStep= 10;
    } else if (diff > 20) {
        levelStep = 5;
    }

    const data: ChartData = {
        labels: dateList,
        datasets: [
            {
                label: 'レベル',
                borderColor: 'pink',
                data: levelList,
                yAxisID: 'level',
            },
            {
                label: '経験値',
                borderColor: 'lightgreen',
                data: expList,
                yAxisID: 'percent',
            },
        ],
    };

    const options: ChartOptions = {
        title: {
            display: true,
            text: 'Lv/Exp推移グラフ',
        },
        elements: {
            line: {
                tension: 0,
                fill: false,
            },
        },
        scales: {
            yAxes: [{
                id: 'percent',
                position: 'right',
                ticks: {
                    min: 0,
                    max: 100,
                    callback: val => val + '%',
                },
            }, {
                id: 'level',
                position: 'left',
                ticks: {
                    min: minLevel,
                    max: maxLevel,
                    stepSize: levelStep,
                    callback: val => val,
                },
            }],
        }
    };

    new Chart(context, {
        type: 'line',
        data,
        options,
    });
});
