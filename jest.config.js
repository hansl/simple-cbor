module.exports = {
  "roots": [
    "./src",
    "./encoders"
  ],
  testMatch: [
    "**/*_spec.ts"
  ],
  "transform": {
    "^.+\\.(ts|tsx)?$": "ts-jest"
  },
}
