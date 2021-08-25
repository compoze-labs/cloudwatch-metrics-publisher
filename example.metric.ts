import { CloudWatchClientConfig } from "@aws-sdk/client-cloudwatch";
import { MetricPublisher } from "./metrics.client";

class ExampleMetric extends MetricPublisher {
    constructor(configuration?: CloudWatchClientConfig) {
        super('ExampleMetric', 'Example/Metric')
    }
}

const createExampleMetric = (configuration?: CloudWatchClientConfig): ExampleMetric => {
    return new ExampleMetric(configuration);
}


const exampleMetric: MetricPublisher = createExampleMetric({
    region: 'us-east-2',
});

export default exampleMetric;