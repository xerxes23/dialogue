const expect = require("expect");

const generateMessage = require("./message");
const generateLocationMessage = require("./locationMessage");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    const from = "Mark Cuban";
    const text = "You rock!";

    const res = generateMessage(from, text);

    expect(res.from).toBe(from);
    expect(res.text).toBe(text);
    expect(typeof res.createdAt).toBe("number");
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct message object", () => {
    const from = "Mark Cuban";
    const lat = 2;
    const lon = 3;
    const url = `https://www.google.com/maps?q=${lat},${lon}`;

    const res = generateLocationMessage(from, lat, lon);

    expect(res.from).toBe(from);
    expect(res.link).toBe(url);
    expect(typeof res.createdAt).toBe("number");
  });
});
