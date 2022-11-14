# Latam Ticket Finder

> **Warning:**
> Aparently AWS(Lambda/Serverless) & GCP(CloudRun) are blocked from making requests to AkamaiGHost. Right now only works locally or on compute engine.

## Serverless Lambda

Lambda function using the serverless framework for deploying a cron job to search for tickets on Latam Airlines and email the results.

It checks a 30 days combination of flights and returns the ones that match the following criteria set on your .env file:

- `MIN_DAYS` - Min amount of time on the trip
- `MAX_DAYS` - Max amount of time on the trip
- `MAX_PRICE` - The max amount you're willing to pay for the ticket(R$)
- `ORIGIN`, `DESTINATION` - Airport codes (Ie. "POA", "GRU")
- `INITIAL_DATE` - YYYY-MM-DD format

---

## Configuration

### Setup .env with parameters

```
SENDGRID_API_KEY = <yourSendGridKey>
EMAIL_FROM = <EmailRegisteredOnSendGrid>
EMAIL_TO = <yourEmailHere>
MAX_PRICE = 800
MAX_DAYS = 5
MIN_DAYS = 2
INITIAL_DATE = "2022-12-01"
ORIGIN = "CGH"
DESTINATION = "POA"
```

### Edit `serveless.yaml`

#### Cron schedule to your preference

##### <i> It's recommended not to exceed one a day. Please be reasonable with your api calls.</i>

```
    events:
      - schedule: cron(0 6 ? * MON-FRI *)
```

---

## Serverless install

https://www.serverless.com/framework/docs/getting-started

Set to your organization:

```
serverless --org=<your-org>
```

### Install dependencies:

```
npm install
```

### Run locally

```
npm run invoke
```

### Deploy

```
npm run deploy
```
