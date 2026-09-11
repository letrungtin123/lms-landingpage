const SHEET_NAME = 'data customer';
const NESSO_REPLY_TO = 'CONTACT@NESSO.VN';
const NESSO_BRAND_NAME = 'NESSO LMS';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
    setupSheet_(sheet);

    const data = parseBody_(e);
    const emailResult = maybeSendPrizeEmail_(data);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.website || '',
      data.service || '',
      data.message || '',
      data.acceptance || '',
      data.page || '',
      data.referrer || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || '',
      'Mới',
      '',
      data.prize_id || '',
      data.prize_title || '',
      data.prize_discount || '',
      data.prize_service || '',
      data.prize_weight || '',
      emailResult.sent ? 'Đã gửi' : '',
      emailResult.sent ? new Date() : '',
      emailResult.error || ''
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    sheet.getRange(lastRow, 13).setValue('Mới');
    if (emailResult.sent) sheet.getRange(lastRow, 21).setNumberFormat('dd/MM/yyyy HH:mm:ss');

    return json_({ ok: true, prize_email_sent: emailResult.sent });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

function parseBody_(e) {
  const data = {};

  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (key) {
      data[key] = e.parameter[key];
    });
  }

  if (!e || !e.postData || !e.postData.contents) return data;

  const body = String(e.postData.contents || '');
  const type = String(e.postData.type || '').toLowerCase();

  if (type.indexOf('application/json') > -1) {
    try {
      Object.assign(data, JSON.parse(body));
    } catch (err) {}
    return data;
  }

  if (body.indexOf('=') > -1) {
    body.split('&').forEach(function (pair) {
      if (!pair) return;
      const parts = pair.split('=');
      const key = decodeURIComponent((parts.shift() || '').replace(/\+/g, ' '));
      const value = decodeURIComponent((parts.join('=') || '').replace(/\+/g, ' '));
      if (key) data[key] = value;
    });
  }

  return data;
}

function setupSheet_(sheet) {
  const headers = [
    'Thời gian',
    'Họ và tên',
    'Email',
    'Website công ty',
    'Nhu cầu tư vấn',
    'Nội dung cần tư vấn',
    'Đồng ý tư vấn',
    'Trang gửi form',
    'Referrer',
    'UTM Source',
    'UTM Medium',
    'UTM Campaign',
    'Trạng thái',
    'Ghi chú sale',
    'Mã giải',
    'Kết quả trúng thưởng',
    'Tỷ lệ giảm',
    'Dịch vụ áp dụng',
    'Tỷ lệ quay',
    'Email voucher',
    'Thời gian gửi email',
    'Lỗi gửi email'
  ];

  const firstRow = sheet.getRange(1, 1, 1, Math.max(headers.length, sheet.getLastColumn() || 1)).getValues()[0];
  const hasHeader = firstRow.some(Boolean);

  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    for (let i = 0; i < headers.length; i++) {
      if (!firstRow[i]) sheet.getRange(1, i + 1).setValue(headers[i]);
    }
  }

  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange
    .setBackground('#001117')
    .setFontColor('#5EDFFF')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sheet.getRange(1, 1, Math.max(sheet.getMaxRows(), 1), headers.length).setWrap(true).setVerticalAlignment('middle');
  sheet.autoResizeColumns(1, headers.length);

  if (!sheet.getFilter()) {
    sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), headers.length).createFilter();
  }
}

function maybeSendPrizeEmail_(data) {
  const shouldSend = String(data.send_prize_email || '').toLowerCase() === 'yes';
  if (!shouldSend || !isValidEmail_(data.email) || !clean_(data.prize_title)) {
    return { sent: false, error: '' };
  }

  try {
    sendPrizeEmail_(data);
    return { sent: true, error: '' };
  } catch (err) {
    return { sent: false, error: String(err && err.message ? err.message : err) };
  }
}

function sendPrizeEmail_(data) {
  const name = clean_(data.name) || 'bạn';
  const email = clean_(data.email);
  const discount = clean_(data.prize_discount) || extractDiscount_(data.prize_title) || 'voucher';
  const service = clean_(data.prize_service) || 'dịch vụ của NESSO';
  const prizeTitle = clean_(data.prize_title) || ('Voucher giảm ' + discount);
  const subject = 'NESSO xác nhận voucher ' + discount + ' dành cho ' + name;
  const plainBody = [
    'Chúc mừng ' + name + ',',
    '',
    'Bạn đã nhận được ' + prizeTitle + '.',
    'Dịch vụ áp dụng: ' + service + '.',
    'Hiệu lực: 30 ngày kể từ ngày phát hành.',
    '',
    'Bộ phận BD của NESSO sẽ liên hệ lại để tư vấn gói phù hợp và hướng dẫn cách sử dụng voucher.',
    '',
    'NESSO LMS',
    NESSO_REPLY_TO
  ].join('\n');

  MailApp.sendEmail({
    to: email,
    subject: subject,
    name: NESSO_BRAND_NAME,
    replyTo: NESSO_REPLY_TO,
    body: plainBody,
    htmlBody: buildPrizeEmailHtml_({
      name: name,
      discount: discount,
      service: service,
      prizeTitle: prizeTitle
    })
  });
}

function buildPrizeEmailHtml_(data) {
  const name = html_(data.name);
  const discount = html_(data.discount);
  const service = html_(data.service);
  const prizeTitle = html_(data.prizeTitle);

  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f7f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f7f8;margin:0;padding:0;border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:28px 14px;">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:640px;max-width:100%;border-collapse:separate;background:#071112;border:1px solid #1fbfd8;border-radius:22px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
          <tr>
            <td style="padding:30px 32px 22px 32px;border-bottom:1px solid rgba(31,191,216,0.22);font-family:Arial,Helvetica,sans-serif;">
              <div style="font-size:12px;line-height:18px;letter-spacing:2px;text-transform:uppercase;color:#35d7f2;font-weight:600;font-family:Arial,Helvetica,sans-serif;">NESSO LMS</div>
              <div style="margin-top:16px;font-size:30px;line-height:38px;color:#ffffff;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Chúc mừng ${name}</div>
              <div style="margin-top:10px;font-size:15px;line-height:24px;color:#c7d2d6;font-weight:400;font-family:Arial,Helvetica,sans-serif;">Bạn đã hoàn tất vòng quay may mắn và nhận được voucher từ NESSO.</div>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 30px 32px;font-family:Arial,Helvetica,sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;border:1px solid #35d7f2;border-radius:18px;background:#091819;">
                <tr>
                  <td align="center" style="padding:26px 20px 24px 20px;font-family:Arial,Helvetica,sans-serif;">
                    <div style="font-size:12px;line-height:18px;letter-spacing:1.4px;text-transform:uppercase;color:#9ceefa;font-weight:600;font-family:Arial,Helvetica,sans-serif;">Voucher của bạn</div>
                    <div style="margin-top:8px;font-size:42px;line-height:50px;color:#37d9f5;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Giảm ${discount}</div>
                    <div style="margin-top:6px;font-size:16px;line-height:23px;color:#ffffff;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${service}</div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:22px;border-collapse:separate;border:1px solid rgba(255,255,255,0.14);border-radius:16px;background:#121b1d;">
                <tr>
                  <td style="padding:20px 22px;font-size:14px;line-height:23px;color:#dce7ea;font-weight:400;font-family:Arial,Helvetica,sans-serif;">
                    <div><span style="color:#ffffff;font-weight:700;">Kết quả:</span> ${prizeTitle}</div>
                    <div style="margin-top:6px;"><span style="color:#ffffff;font-weight:700;">Hiệu lực:</span> 30 ngày kể từ ngày phát hành.</div>
                    <div style="margin-top:6px;"><span style="color:#ffffff;font-weight:700;">Áp dụng:</span> khách hàng/doanh nghiệp đăng ký mới.</div>
                  </td>
                </tr>
              </table>

              <div style="margin-top:22px;font-size:14px;line-height:24px;color:#b7c4c8;font-weight:400;font-family:Arial,Helvetica,sans-serif;">
                Bộ phận BD của NESSO sẽ liên hệ lại để tư vấn gói phù hợp và hướng dẫn cách sử dụng voucher. Voucher không quy đổi thành tiền mặt và không áp dụng đồng thời với các chương trình ưu đãi khác.
              </div>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto 0 auto;border-collapse:separate;">
                <tr>
                  <td align="center" bgcolor="#36d8f4" style="border-radius:999px;background:#36d8f4;">
                    <a href="mailto:${NESSO_REPLY_TO}" style="display:inline-block;padding:13px 28px;color:#031015;text-decoration:none;font-size:14px;line-height:18px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Liên hệ NESSO</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px;background:#0b191b;color:#8ea0a6;font-size:12px;line-height:19px;font-weight:400;font-family:Arial,Helvetica,sans-serif;">
              Email này được gửi tự động sau khi bạn tham gia vòng quay may mắn trên trang LMS của NESSO. Nếu cần hỗ trợ, vui lòng phản hồi email này hoặc liên hệ <a href="mailto:${NESSO_REPLY_TO}" style="color:#35d7f2;text-decoration:none;">${NESSO_REPLY_TO}</a>.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
function extractDiscount_(value) {
  const match = String(value || '').match(/(\d+%)/);
  return match ? match[1] : '';
}

function clean_(value) {
  return String(value == null ? '' : value).trim();
}

function html_(value) {
  return clean_(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean_(value));
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}