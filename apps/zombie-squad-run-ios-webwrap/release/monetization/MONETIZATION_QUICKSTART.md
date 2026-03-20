# Monetization Quickstart

This release scaffold is set up for the fastest safe path:
- launch as a paid app first
- add rewarded revive later
- keep ad SDK and IAP complexity out of the first submission

## Recommended launch model
- `paid-upfront`
- use `$0.99` if speed and impulse-buy conversion matter most
- use `$1.99` if you want slightly better revenue per download and the visuals feel polished enough

## Main config file
- `launch-config.json`

## What to set before submission
- choose `paidPriceTier`
- confirm whether `rewardedRevivePlanned` stays true for the next update
- review `futureMonetization`
- make sure the App Store review notes still match reality

## Validation
Run:
```bash
npm run check:monetization
```

## Important note
If you move to a free launch with rewarded revive or any ad SDK, update privacy disclosures and App Store answers before shipping that version.
