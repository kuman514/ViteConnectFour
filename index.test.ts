describe('Sample test', () => {
  it('should say that 1 + 2 === 3', () => {
    expect(1 + 2).toStrictEqual(3);
  });

  // prettier-ignore
  it('should say that 1 + 2 !== \'3\'', () => {
    expect(1 + 2).not.toStrictEqual('3');
  });
});
