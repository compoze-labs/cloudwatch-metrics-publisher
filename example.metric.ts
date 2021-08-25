import { MetricPublisher } from "./metrics.client";

class ExampleMetric extends MetricPublisher {
    constructor() {
        super('ExampleMetric', 'Example/Metric')
    }
}

const createNotificationFailed = (): ExampleMetric => {
    return new ExampleMetric();
}


const notificationFailedMetric: MetricPublisher = createNotificationFailed();

export default notificationFailedMetric;