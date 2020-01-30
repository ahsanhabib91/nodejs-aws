import * as AWS from 'aws-sdk';

class AWSSQS {
	sqs: any;
	URL_FIFO_SQS: string = 'https://sqs.eu-west-1.amazonaws.com/954982581590/BS23_FIFO_QUEUE.fifo';
	URL_STANDARD_SQS: string = 'https://sqs.eu-west-1.amazonaws.com/954982581590/BS23_STANDARD_QUEUE';
	constructor() {
		console.log('testing sqs ...');
		AWS.config.update({region: 'eu-west-1'});
		this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
	}

	createStandardQueue() {
		var params = {
			QueueName: 'BS23_STANDARD_QUEUE',
			Attributes: {
				'DelaySeconds': '60',
				'MessageRetentionPeriod': '86400'
			}
		};

		this.sqs.createQueue(params, function(err, data) {
			if (err) {
				console.log("Error", err);
			} else {
				console.log("Success", data.QueueUrl);
			}
		});
	}

	async createFifoQueue() {
		try {
			const params = {
				QueueName: 'BS23_FIFO_QUEUE.fifo',
				Attributes: {
					DelaySeconds: '60',
					MessageRetentionPeriod: '86400',
					FifoQueue: 'true'
				}
			};
			const data = await this.sqs.createQueue(params).promise();
			console.log("Success", data.QueueUrl);
		} catch (err) {
			console.log("Error", err);
		}
	}

	async listQueues() {
		try {
			const params = {};
			const data = await this.sqs.listQueues(params).promise();
			console.log("Success", data.QueueUrls);
		} catch (err) {
			console.log("Error", err);
		}

	}

	async getQueueUrl() {
		const params = {
			QueueName: 'BS23_FIFO_QUEUE.fifo'
		};
		// try {
		// 	const data = await this.sqs.getQueueUrl(params).promise();
		// 	console.log("Success", data.QueueUrls);
		// } catch (err) {
		// 	console.log("Error", err);
		// }
		this.sqs.getQueueUrl(params, function(err, data) {
			if (err) {
				console.log("Error", err);
			} else {
				console.log("Success", data.QueueUrl);
			}
		});
	}

	sendMessage(queueURL) {
		const params = {
			DelaySeconds: 10,
			MessageAttributes: {
				"Title": {
					DataType: "String",
					StringValue: "The Whistler"
				},
				"Author": {
					DataType: "String",
					StringValue: "John Grisham"
				},
				"WeeksOn": {
					DataType: "Number",
					StringValue: "6"
				}
			},
			MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
			// MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
			// MessageId: "Group1",  // Required for FIFO queues
			QueueUrl: queueURL
		};

		this.sqs.sendMessage(params, function(err, data) {
			if (err) {
				console.log("Error", err);
			} else {
				console.log("Success", data.MessageId);
			}
		});
	}

	receiveMessage(queueURL, count) {
		const params = {
				AttributeNames: [
					"SentTimestamp"
				],
				MaxNumberOfMessages: 10,
				MessageAttributeNames: [
					"All"
				],
				QueueUrl: queueURL,
				VisibilityTimeout: 1,
				WaitTimeSeconds: 0
		   };
		this.sqs.receiveMessage(params, (err, data) => {
			if (err) {
				console.log("Receive Error", err);
			} else if (data.Messages) {
				console.log(count, data.Messages[0]);
				// const deleteParams = {
				// 	QueueUrl: queueURL,
				// 	ReceiptHandle: data.Messages[0].ReceiptHandle
				// };
				// this.sqs.deleteMessage(deleteParams, function(err, data) {
				// 	if (err) {
				// 		console.log("Delete Error", err);
				// 	} else {
				// 		console.log("Message Deleted", data);
				// 	}
				// });
			}
		});
	}

	getCredentials() {

		AWS.config.getCredentials(function(err) {
			if (err) console.log(err.stack);
			// credentials not loaded
			else {
			  console.log("Access key:", AWS.config.credentials.accessKeyId);
			  console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
			  console.log("Region: ", AWS.config.region);
			}
		  });
	}

}

let aws_sqs = new AWSSQS();
const URL_FIFO_SQS: string = 'https://sqs.eu-west-1.amazonaws.com/954982581590/BS23_FIFO_QUEUE.fifo';
const URL_STANDARD_SQS: string = 'https://sqs.eu-west-1.amazonaws.com/954982581590/BS23_STANDARD_QUEUE';
// aws_sqs.createStandardQueue();
// aws_sqs.createFifoQueue();
// aws_sqs.listQueues();
// aws_sqs.getQueueUrl();
aws_sqs.sendMessage(URL_FIFO_SQS);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
let count = 0;
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
// setInterval(() => {
// 	console.log('1 receiveMessage ...', count++);
// 	aws_sqs.receiveMessage(URL_STANDARD_SQS, 1);
// }, 1000);
// setInterval(() => {
// 	console.log('2 receiveMessage ...', count++);
// 	aws_sqs.receiveMessage(URL_STANDARD_SQS, 2);
// }, 1000);
// setInterval(() => {
// 	console.log('3 receiveMessage ...', count++);
// 	aws_sqs.receiveMessage(URL_STANDARD_SQS, 3);
// }, 1000);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);
// aws_sqs.receiveMessage(URL_STANDARD_SQS);