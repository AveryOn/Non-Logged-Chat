// LazyLoading
function LazyLoading(delay) {
    this.delay = delay;
    this.dataEntries = [];

    this.payload = function (iterData, callback) {
        this.dataEntries.push(iterData);
        const intervalID = setInterval(() => {
            this.intervalCount++;
            if (this.dataEntries.length) {
                callback([...this.dataEntries]);
                this.dataEntries.length = 0;
                clearInterval(intervalID);
                return;
            }
        }, this.delay);
    }
}

// lazy loading - отслеживание многократно исполняемого действия
function LL_HeartBeat(delay) {
    let dataEntries = [];
    let firstLength = 0;
    let secondLength = 0;
    let intervalID = null;
    this.startInterval = function (callback) {
        intervalID = setInterval(() => {
            secondLength = dataEntries.length;
            if ((secondLength - firstLength) > 0) {
                firstLength = secondLength;
            } else {
                callback(false);
                clearInterval(intervalID);
                dataEntries.length = 0;
                firstLength = 0;
                secondLength = 0;
            }

        }, delay)
    }
    this.payload = function (data, stopInterval, callback) {
        dataEntries.push(data);
        // Если выполнение payload началось
        if (dataEntries.length === 1) {
            firstLength = dataEntries.length;
            callback(true);
            // Запуск интервала
            this.startInterval((isWork) => {
                callback(isWork)
            });
        }
        // Принудительная остановка интервала
        if(stopInterval){
            if(intervalID){
                clearInterval(intervalID);
                dataEntries.length = 0;
                firstLength = 0;
                secondLength = 0;
                return callback(0);
            }
        }
    }
    return {
        payload: this.payload,
        startInterval: this.startInterval,
    };
}

const exportData = {
    LL_HeartBeat,
    LazyLoading
}

export default exportData;
