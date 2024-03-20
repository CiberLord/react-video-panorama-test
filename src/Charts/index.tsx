import React from 'react';
import { LineChart, Bar, BarChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { json } from './data';
import { Card } from '../Card';
import styles from './styles.module.css'

const videoTimeData = json.filter((item) => {
    return item.data.context === 'VideoController';
}).map((item) => {
    return {
        time: item.time,
        value: item.data.payload.currentTime as number
    }
}).filter((item) => {
    return item.value !== 0;
});

const scrollValueData = json.filter((item) => {
    return item.data.context === 'ScrollMoveVideoHelper';
}).map((item) => {
    return {
        time: item.time,
        value: item.data.payload.currentTime as number
    }
}).filter((item) => {
    return item.value !== 0;
});

// const data = [{name: 'Page A', uv: 400, pv: 2400, amt: 2400},];

export const Charts = () => {

    return (
        <>
            <Card className={styles.container}>
                <LineChart width={1000} height={500} data={videoTimeData}>
                    <Line dot={false} type="monotone" dataKey="value" stroke="#8884d8" />
                    {/* <CartesianGrid stroke="#ccc" />*/}
                    {/* <XAxis dataKey="time" /> */}
                    <YAxis />
                </LineChart>
            </Card>
            <Card className={styles.container}>
                <BarChart width={1000} height={500} data={scrollValueData}>
                    <Bar dataKey="value" fill="#8884d8" />
                    {/* <Line dot={false} type="monotone" dataKey="value" stroke="#8884d8" /> */}
                    {/* <CartesianGrid stroke="#ccc" />*/}
                    {/* <XAxis dataKey="time" /> */}
                    <YAxis />
                </BarChart>
            </Card>
        </>
    )
}