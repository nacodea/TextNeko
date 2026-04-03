// 半角英数・記号・スペースを全角へ（かなは対象外の簡易版）
export const hankakuToZenkaku = (text: string) => {
  return text.replace(/[!-~ ]/g, (s) => {
    if (s === " ") return "　";
    const code = s.charCodeAt(0) + 0xfee0;
    return String.fromCharCode(code);
  });
};
