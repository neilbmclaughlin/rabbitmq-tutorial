#!/usr/bin/env node

const amqp = require('amqplib/callback_api')
const queue = 'task-queue'

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1
    }

    channel.assertQueue(queue, { durable: true })
    channel.prefetch(1)

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)

    channel.consume(queue, function (msg) {
      const secs = msg.content.toString().split('.').length - 1

      console.log(' [x] Received %s', msg.content.toString())
      setTimeout(function () {
        console.log(' [x] Done')
        channel.ack(msg)
      }, secs * 1000)
    }, {
      noAck: false
    })
  })
})
