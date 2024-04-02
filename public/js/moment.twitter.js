// 处理发布时间 moment.js
// moment.js locale
moment.updateLocale('zh-cn', {
    meridiem: function (hour, minute, isLowercase) {
        if (hour < 6) {
            return "凌晨";
        } else if (hour < 9) {
            return "早上";
        } else if (hour < 11 && minute < 30) {
            return "上午";
        } else if (hour < 13 && minute < 30) {
            return "中午";
        } else if (hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    }
});
// moment.js twitter plugin
(function () {
    var day, formats, hour, initialize, minute, second, week;
    second = 1e3;
    minute = 6e4;
    hour = 36e5;
    day = 864e5;
    week = 6048e5;
    year = new Date().getFullYear();
    formats = {
        seconds: {
            short: ' 秒前',
            long: ' 秒前'
        },
        minutes: {
            short: ' 分前',
            long: ' 分前'
        },
        hours: {
            short: ' 小时前',
            long: ' 小时前'
        },
        days: {
            short: ' 天前',
            long: ' 天前'
        }
    };

    initialize = function (moment) {
        var twitterFormat;
        twitterFormat = function (format) {
            var diff, num, unit, unitStr;
            diff = Math.abs(this.diff(moment()));
            unit = null;
            num = null;
            if (diff <= second) {
                unit = 'seconds';
                num = 1;
            } else if (diff < minute) {
                unit = 'seconds';
            } else if (diff < hour) {
                unit = 'minutes';
            } else if (diff < day) {
                unit = 'hours';
            } else if (format === 'long') {
                if (diff < week) {
                    unit = 'days';
                } else if (this.year() == year) {
                    return this.format('MM月DD日，HH:mm');
                } else {
                    return this.format('YYYY年MM月DD日，HH:mm');
                }
            } else {
                return this.format('YYYY年MM月DD日，HH:mm');
            }
            if (!(num && unit)) {
                num = moment.duration(diff)[unit]();
            }
            unitStr = unit = formats[unit][format];
            if (format === 'long' && num > 1) {
                unitStr += '';
            }
            return num + unitStr;
        };
        moment.fn.twitterLong = function () {
            return twitterFormat.call(this, 'long');
        };
        moment.fn.twitter = moment.fn.twitterShort = function () {
            return twitterFormat.call(this, 'short');
        };
        return moment;
    };

    if (typeof define === 'function' && define.amd) {
        define('moment-twitter', ['moment'], function (moment) {
            return this.moment = initialize(moment);
        });
    } else if (typeof module !== 'undefined') {
        module.exports = initialize(require('moment'));
    } else if (typeof window !== "undefined" && window.moment) {
        this.moment = initialize(this.moment);
    }

}).call(this);
