// 全角英数・記号・スペースを半角へ（かなは対象外の簡易版）
export const zenkakuToHankaku = (text: string) => {
  return text.replace(/[！-～]|　/g, (s) => {
    if (s === "　") return " ";
    const code = s.charCodeAt(0) - 0xfee0;
    return String.fromCharCode(code);
  });
};
