export const email_check = (email) => {
    var regex=/([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; 
    return (email != '' && email != 'undefined' && regex.test(email));
}

export const phoneFormat = (phone) => {
    return phone
      .replace(/[^0-9]/g, '')
      .replace(
        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
        '$1-$2-$3'
      )
      .replace('--', '-');
};

export const textLengthOverCut = (txt, len, lastTxt) => {
  if (len == "" || len == null) { // 기본값
      len = 20;
  }
  if (lastTxt == "" || lastTxt == null) { // 기본값
      lastTxt = "...";
  }
  if (txt.length > len) {
      txt = txt.substr(0, len) + lastTxt;
  }
  return txt;
}


export const numberFormat = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
