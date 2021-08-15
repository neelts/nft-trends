"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_trends_api_1 = require("google-trends-api");
const fs = require("fs");
const period = (time) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return JSON.parse(yield google_trends_api_1.interestOverTime(Object.assign({ keyword: 'NFT', timezone: 0, granularTimeResolution: true }, (time ? { startTime: new Date(Date.now() - time) } : null))));
    }
    catch (e) {
        console.log(e);
    }
});
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    const day = 24 * 60 * 60 * 1000;
    const month = day * 30;
    const year = day * 355;
    const transform = (data) => data.default.timelineData.map(value => [value.time, value.formattedTime, `${value.value[0]}`]);
    const h = transform(yield period(day));
    const d = transform(yield period(day * 7 - 10));
    const w = transform(yield period(month * 9 - day));
    const m = transform(yield period(year * 5 + month * 3 + day * 24));
    const y = transform(yield period());
    fs.writeFileSync('trend.json', JSON.stringify({ h, d, w, m, y }, null, 2));
});
get();
//# sourceMappingURL=index.js.map