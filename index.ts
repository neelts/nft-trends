import {interestOverTime} from "google-trends-api";
import * as fs from "fs";

type Data = {
    default: {
        timelineData: {
            time: string,
            formattedTime: string,
            value: number[],
        }[]
    }
}

type Record = [t: string, f: string, v: string]

const period = async (time?: number): Promise<Data> => {
    try {
        return JSON.parse(await interestOverTime({
            keyword: 'NFT', timezone: 0,
            granularTimeResolution: true,
            ...(time ? {startTime: new Date(Date.now() - time)} : null),
        }));
    } catch (e) {
        console.log(e);
    }
}

const sleep = (): Promise<void> => new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

const get = async (): Promise<void> => {



    const day = 24 * 60 * 60 * 1000;
    const month = day * 30;
    const year = day * 355;

    const request = async (request: () => Promise<Data>): Promise<Data> => {
        let retries: number = 10;
        do {
            const data: Data = await request();
            await sleep();
            console.log('>>> ' + retries);
            if (data?.default?.timelineData)
                return data;
            else
                retries--;
        } while (retries > 0);
        return null;
    };

    const transform = (data: Data): Record[] => data.default.timelineData.map(
        value => [value.time, value.formattedTime, `${value.value[0]}`]
    );
    const h = transform(await request(() => period(day)));
    const d = transform(await request(() => period(day * 7 - 10)));
    const w = transform(await request(() => period(month * 9 - day)));
    const m = transform(await request(() => period(year * 5 + month * 3 + day * 24)));
    const y = transform(await request(() => period()));
    fs.writeFileSync('trend.json', JSON.stringify({h, d, w, m, y}, null, 2));
};

get();