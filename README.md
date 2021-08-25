# cloudwatch-metrics-publisher

Repository that contains example for using @aws-sdk/client-cloudwatch to publish metrics with NodeJS and Typescript. This is not currently a published library, so in order to use this pattern you can simply copy the necessary code into your repository. If there is interest a library could be published.

## Prerequisites

1. Install the cloudwatch sdk: `npm i @aws-sdk/client-cloudwatch` or `yarn add @aws-sdk/client-cloudwatch`
2. Install winston ```npm i winston` or `yarn add winston`
3. Configure application permissions to publish metrics. Example CloudFormation Policy:

```yaml
LambdaCloudwatchPublishMetricsPolicy:
  Type: AWS::IAM::Policy
  Properties:
    PolicyName: LambdaCloudwatchPublishMetricsPolicy
    PolicyDocument:
      Statement:
        - Effect: Allow
          Action:
            - cloudwatch:PutMetricData
          Resource: "*"
    Roles:
      - !Ref MyAppRole
```

Note that this must be attached to the Role that your application is assuming. [Docs on Lambda Execution Role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)

## Usage

In order to publish a new metric, you simply create a new class that extends the [MetricPublisher](metrics.client.ts) class, and export the class instantiation

1. After extending the class, ensure that you provide a unique MetricName and Namespace. A description of Cloudwatch terms and concepts can be found [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html). Example:

```typescript
class ExampleMetric extends MetricPublisher {
  constructor(configuration?: CloudWatchClientConfig) {
    super("ExampleMetric", "Example/Metric");
  }
}
```

2. Once you have implemented your metric, create a method to instantiate the class and export it

```typescript
const createExampleMetric = (
  configuration?: CloudWatchClientConfig
): ExampleMetric => {
  return new ExampleMetric(configuration);
};

const exampleMetric: MetricPublisher = createExampleMetric();

export default exampleMetric;
```

3. Once you have created the metric, you can simply import it and call the publish function (that is inherited from the [MetricPublisher](metrics.client.ts) abstract class)

```typescript
import exampleMetric from "./example.metric.ts";

const doSomething = () => {
  //do logic

  exampleMetric.publish();
};
```

4. Configuration: By default, the metrics classes will default to the local AWS role and us-east-1 region. In order to supply custom configuration, update the create method to pass in your customer [CloudWatchClientConfig](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/interfaces/cloudwatchclientconfig.html).

for example, if you want to update the region that you are publishing your metrics to, simply provide a custom configuration with your target region. It is worth noting that it is generally a good idea to provide the region at runtime (via something like an Environment Variable) for maximum portability.

```typescript
const exampleMetric: MetricPublisher = createExampleMetric({
  region: "us-east-2",
});
```

## Design Choices

The inspiration for the usage of a metric class is based on the winston implementation:

```typescript
const logger: winston.Logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.json()
  ),
  defaultMeta: { service: "notifications-module" },
  transports: [
    new winston.transports.Console({
      format: winston.format.timestamp(),
    }),
  ],
});

export default logger;
```

This allows for simple import and usage across the app, without having to worry about passing around dependencies.

Currently, the client is configured **not** to throw an error if it failed to publish the metric, rather it logs a warning message of `Failed to publish metric`. The decision was made that, should a metric fail to publish, it should not fail the request entirely.
