// tests/api.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Bank = require('../Models/Bank');

const app = express();
app.use(express.json());

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true });
  await Bank.deleteMany({});
  await Bank.create({ name: 'Test Bank', branches: [{ branch: 'Main', ifsc: 'TEST0001' }] });
});

afterAll(async () => {
  await mongoose.disconnect();
});

app.get('/banks', async (req, res) => {
  const banks = await Bank.find().exec();
  res.json(banks);
});

app.get('/banks/:name/branches', async (req, res) => {
  const bank = await Bank.findOne({ name: req.params.name }).exec();
  if (bank) {
    res.json(bank.branches);
  } else {
    res.status(404).send('Bank not found');
  }
});

describe('Bank API', () => {
  it('should get all banks', async () => {
    const res = await request(app).get('/banks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
  });

  it('should get branches for a specific bank', async () => {
    const res = await request(app).get('/banks/Test Bank/branches');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].branch).toEqual('Main');
  });
});
