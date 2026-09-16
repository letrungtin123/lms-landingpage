/* ============================================================
   NESSO LMS Landing Page — JS
   Supports: standalone (direct open) + iframe (WP embed)
   ============================================================ */

const isInIframe = window.self !== window.top;
const nessoLmsUrlParams = new URLSearchParams(window.location.search);
const isParentHeaderManaged = isInIframe && nessoLmsUrlParams.get('parentHeader') === '1';
const NESSO_CONTACT_MAIL_ENDPOINT = 'https://nesso.vn/wp-json/nesso-lms/v1/contact';
const NESSO_LUCKY_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwqKxpyAqIQqJE4CER4Y_0c_90TmRAAXa1oZu3vMHPgV78RWMXo4lvkyhSMO7fJBl0f/exec';
const NESSO_LUCKY_WHEEL_ROUTE_CODE = '482917306584';
const NESSO_IMAGE_ONLY_ROUTES = {
  '9184726503918274': {
    label: 'THI',
    desktop: 'https://nesso.vn/wp-content/uploads/2026/08/THI-scaled.png',
    mobile: 'https://nesso.vn/wp-content/uploads/2026/08/MB_THI-scaled.png'
  },
  '6402819573064918': {
    label: 'THOA',
    desktop: 'https://nesso.vn/wp-content/uploads/2026/08/THOA-2-scaled.png',
    mobile: 'https://nesso.vn/wp-content/uploads/2026/08/Thoa-3-scaled.png'
  }
};
const NESSO_IMAGE_ONLY_ROUTE_CODES = Object.keys(NESSO_IMAGE_ONLY_ROUTES);
const NESSO_LANGUAGE_STORAGE_KEY = 'nesso-lms-language';
const NESSO_LANGUAGE_DEFAULT = 'vi';
const NESSO_LANGUAGE_SUPPORTED = new Set(['vi', 'en']);
const NESSO_DOCUMENT_COPY = {
  vi: {
    title: 'NESSO - Giai phap Cong nghe chuyen doi hoc tap',
    description: 'Chung toi truc quan hoa he thong dao tao cho doanh nghiep.'
  },
  en: {
    title: 'NESSO - Learning Transformation Technology Solutions',
    description: 'We visualize enterprise training systems through LMS, learning experience design, and digital learning content.'
  }
};

function applyNessoLmsFeaturesMediaLanguage(lang = NESSO_LANGUAGE_DEFAULT) {
  const safeLang = NESSO_LANGUAGE_SUPPORTED.has(lang) ? lang : NESSO_LANGUAGE_DEFAULT;

  document.querySelectorAll('[data-nesso-lms-features-media]').forEach(element => {
    const viSource = element.getAttribute('data-nesso-lms-features-src-vi') || '';
    const enSource = element.getAttribute('data-nesso-lms-features-src-en') || '';
    const source = safeLang === 'en' && enSource ? enSource : viSource;
    if (!source) return;

    if (element.tagName === 'IMG') {
      if (element.getAttribute('src') !== source) element.setAttribute('src', source);
      return;
    }

    element.style.backgroundImage = `url("${source}")`;
  });

  document.querySelectorAll('[data-nesso-lms-feature-details-media]').forEach(element => {
    const viSource = element.getAttribute('data-nesso-lms-feature-details-src-vi') || '';
    const enSource = element.getAttribute('data-nesso-lms-feature-details-src-en') || '';
    const source = safeLang === 'en' && enSource ? enSource : viSource;
    if (!source) return;
    if (element.tagName === 'IMG' && element.getAttribute('src') !== source) element.setAttribute('src', source);
  });
}

const NESSO_I18N_EN = new Map([
  ['Điều hướng LMS', 'LMS navigation'],
  ['Chuyển đổi ngôn ngữ', 'Switch language'],
  ['Trang chủ', 'Home'],
  ['Chức năng LMS', 'LMS Features'],
  ['Blog', 'Blog'],
  ['Liên hệ', 'Contact'],
  ['Liên hệ với Nesso', 'Contact Nesso'],
  ['Liên hệ với Nesso để báo giá chi tiết', 'Contact Nesso for a detailed quote'],
  ['Vòng xoay may mắn', 'Lucky Wheel'],
  ['Demo', 'Demo'],
  ['Trải nghiệm LMS', 'LMS Experience'],
  ['Trải nghiệm demo', 'Demo experience'],
  ['Tắt demo', 'Close demo'],
  ['NESSO Home', 'NESSO Home'],
  ['Danh mục slide proposal', 'Proposal slide menu'],
  ["NESSO's Proposal", "NESSO's Proposal"],
  ['Hệ Sinh Thái', 'Our'],
  ['Của Chúng Tôi', 'Ecosystem'],
  ['Giải Pháp Đột Phá, Thiết Kế Cho Riêng Bạn', 'Breakthrough Solutions, Designed Around You'],
  ['Proposal Engine Ver. 1.0', 'Proposal Engine Ver. 1.0'],
  ['Lộ trình học trực quan', 'Visual Learning Journey'],
  ['Lộ trình học trực quan từ kiến thức đến NESSO LMS', 'Visual learning journey from knowledge to NESSO LMS'],
  ['Lợi thế cạnh tranh', 'Competitive Advantage'],
  ['Lợi thế cạnh tranh của Nesso LMS', 'Competitive advantage of Nesso LMS'],
  ['Thiết kế trải nghiệm học tập', 'Learning Experience Design'],
  ['Giải pháp chuyển đổi học tập', 'Learning Transformation Solution'],
  ['Giá trị mang lại', 'Delivered Value'],
  ['Quy trình hợp tác', 'Collaboration Process'],
  ['Triển khai & bảng giá', 'Implementation & Pricing'],
  ['Quy trình triển khai và bảng giá chi tiết', 'Implementation process and detailed pricing'],
  ['Chuyển đổi nội dung', 'Content Conversion'],
  ['Chuyển đổi nội dung đào tạo', 'Training Content Conversion'],
  ['Hạ tầng lưu trữ', 'Storage Infrastructure'],
  ['Hạ tầng lưu trữ Server Hosting', 'Server Hosting Storage Infrastructure'],
  ['Tagline', 'Tagline'],
  ['Liên hệ Nesso', 'Contact Nesso'],
  ['Visual đạt chuẩn', 'Production-ready'],
  ['Visual đạt chuẩn sản xuất', 'Production-ready visuals'],
  ['sản xuất', 'visuals'],
  ['Hệ sinh thái phát', 'Talent growth'],
  ['triển nhân sự', 'ecosystem'],
  ['Hệ sinh thái phát triển nhân sự', 'Talent growth ecosystem'],
  ['Cuộc', 'A'],
  ['cách mạng trải nghiệm', 'learning revolution'],
  ['học tập từ', 'powered by'],
  ['Giải pháp số hóa', 'digital solutions'],
  ['được thiết kế', 'designed for'],
  ['riêng', 'your business'],
  ['Chúng tôi trực quan hóa hệ thống đào tạo cho doanh nghiệp: từ thiết kế lộ trình đào tạo, đánh giá cá nhân hóa đến sản xuất nội dung học tập số.', 'We visualize enterprise training systems: from learning journey design and personalized assessment to digital learning content production.'],
  ['Xem Proposal', 'View Proposal'],
  ['LMS tích hợp', 'AI-integrated LMS'],
  ['AI Mentor', 'AI Mentor'],
  ['Được tin dùng bởi hơn 100+ doanh nghiệp', 'Trusted by 100+ companies'],
  ['Thế mạnh', 'Core'],
  ['vượt trội', 'advantages'],
  ['10 năm', '10 years'],
  ['kinh nghiệm trong lĩnh vực Visual', 'of experience in visual production'],
  ['Sắc bén từ', 'Sharpened by'],
  ['25 năm', '25 years'],
  ['"lăn lộn" ngành Nhân Sự', 'of hands-on HR consulting'],
  ['Nesso mang đến giải pháp tối ưu bằng phương pháp thiết kế chiến lược đào tạo hiện đại. Giúp bạn bứt tốc và', 'Nesso delivers optimized solutions through modern training strategy design, helping you accelerate and'],
  ['"mở khoá"', 'unlock'],
  ['mọi Thành tựu', 'every milestone'],
  ['Giá trị cốt lõi', 'Core Values'],
  ['LMS tích hợp AI', 'AI-integrated LMS'],
  ['giúp đội ngũ', 'helps teams'],
  ['vận hành hiệu quả hơn', 'operate more efficiently'],
  ['Kế thừa và phát huy tri thức chuyên môn, kinh nghiệm thực tiễn của', 'Inherit and amplify the specialized knowledge and practical experience of'],
  ['“đầu tàu”', 'business leaders'],
  ['doanh nghiệp', 'the enterprise'],
  ['Đảm bảo hiệu quả đào tạo tối ưu thông qua các giải pháp', 'Optimize training outcomes through'],
  ['E-learning', 'E-learning'],
  ['trọn gói, được xây dựng bằng các video cực “dính”, học liệu trực quan và mô phỏng thực tiễn', 'end-to-end solutions built with engaging videos, visual learning assets, and practical simulations'],
  ['Mang đến năng lực đào tạo nhanh chóng, dễ mở rộng quy mô với chất lượng nhất quán và', 'Deliver fast, scalable training capabilities with consistent quality and'],
  ['hiệu quả chi phí vượt trội', 'outstanding cost efficiency'],
  ['Giải pháp', 'Solution'],
  ['Số hoá trải nghiệm', 'Digitize the learning'],
  ['học tập', 'experience'],
  ['Nền tảng LMS/LXP', 'LMS/LXP Platform'],
  ['& Tự động hoá đào tạo', '& Training Automation'],
  ['Hệ sinh thái LMS, tư vấn thiết kế giảng dạy và sản xuất E-learning trọn gói.', 'An end-to-end LMS ecosystem covering instructional design consulting and E-learning production.'],
  ['Thiết kế trải nghiệm học tập tương tác cá nhân hoá', 'Personalized Interactive Learning Experience Design'],
  ['Chuyển đổi tài liệu tĩnh thành trải nghiệm học tập trực quan với Video tương tác và Gamification được thiết kế theo phương pháp luận từ chuyên gia.', 'Transform static documents into visual learning experiences with interactive video and gamification designed through expert methodology.'],
  ['Quản trị tri thức', 'Knowledge Management'],
  ['Rút trích và hệ thống hóa chất xám độc quyền của C-Level thành tài sản số doanh nghiệp, hỗ trợ đào tạo thế hệ kế thừa.', 'Extract and systematize C-level expertise into enterprise digital assets that support successor training.'],
  ['Tăng tốc sản xuất học liệu bằng AI', 'Accelerate Learning Content Production with AI'],
  ['Ứng dụng AI giúp giảm đến 70% thời gian và chi phí sản xuất học liệu số.', 'Apply AI to reduce digital learning content production time and cost by up to 70%.'],
  ['Tại sao chọn Nesso?', 'Why Choose Nesso?'],
  ['Hệ sinh thái nhân sự', 'Complete talent'],
  ['toàn diện', 'ecosystem'],
  ['Hệ sinh thái nhân lực toàn diện', 'Talent ecosystem built on'],
  ['kinh nghiệm trong ngành tư vấn nhân sự', 'of HR consulting experience'],
  ['của Le & Associates và hệ thống phần mềm công nghệ quản trị nhân lực từ SKALE.', 'Le & Associates expertise and SKALE workforce technology.'],
  ['Thầu nhân lực, tối ưu tuyển dụng', 'Workforce Outsourcing'],
  ['Cung cấp trọn gói thầu nhân lực đến tối ưu tuyển dụng', 'End-to-end staffing support, from outsourcing to recruitment optimization.'],
  ['Vận hành & đào tạo toàn diện', 'Operations & Training'],
  ['Vận hành, đào tạo theo mọi quy mô doanh nghiệp với trải nghiệm học tập dựa trên phương pháp luận hiện đại', 'Run and train at enterprise scale with modern learning methods.'],
  ['Gói dịch vụ', 'Service Packages'],
  ['Các gói dịch vụ linh hoạt được thiết kế phù hợp với quy', 'Flexible service packages designed around your company'],
  ['mô, mục tiêu và định hướng phát triển của doanh nghiệp', 'size, goals, and growth direction'],
  ['Chọn nhóm gói dịch vụ', 'Choose service package group'],
  ['Gói tiêu chuẩn', 'Standard Package'],
  ['Gói nâng cao', 'Advanced Package'],
  ['Gói chuyên nghiệp', 'Professional Package'],
  ['Gói DN theo năm', 'Annual Enterprise Package'],
  ['Phổ biến', 'Popular'],
  ['Giá chưa bao gồm VAT', 'VAT excluded'],
  ['Tích hợp', 'Integration'],
  ['Phù hợp bài giảng cốt lõi, yêu cầu tính tương tác và thẩm mỹ cao nhất. Thích hợp cho', 'Suitable for core courses that require the highest level of interaction and visual polish. Ideal for'],
  ['Phù hợp bài giảng kỹ năng, kết hợp công nghệ AI hiện đại. Thích hợp cho', 'Suitable for skill-based training with modern AI support. Ideal for'],
  ['Phù hợp bài giảng lý thuyết, tài liệu nội bộ, tối ưu chi phí. Thích hợp cho', 'Suitable for theory-based lessons and internal documents with optimized cost. Ideal for'],
  ['1 khoá học.', '1 course.'],
  ['3 khoá học.', '3 courses.'],
  ['5-6 khoá học.', '5-6 courses.'],
  ['Assignment', 'Assignment'],
  ['Upload files, viết luận, test tính thời gian', 'File uploads, essay tasks, and timed tests'],
  ['Lên đến', 'Up to'],
  ['2 Assignment', '2 assignments'],
  ['4 Assignment', '4 assignments'],
  ['7 Assignment', '7 assignments'],
  ['Nội dung bài giảng', 'Learning Content'],
  ['2 giờ thời lượng học', '2 hours of learning content'],
  ['5 giờ thời lượng học', '5 hours of learning content'],
  ['8 giờ thời lượng học', '8 hours of learning content'],
  ['lên đến 20 Infographic, 2 sơ đồ, văn bản, audio) +', 'up to 20 infographics, 2 diagrams, text, audio) +'],
  ['20-35 Infographic, 3 sơ đồ, văn bản, audio) +', '20-35 infographics, 3 diagrams, text, audio) +'],
  ['35-50 Infographic, 5 sơ đồ, văn bản, audio) +', '35-50 infographics, 5 diagrams, text, audio) +'],
  ['30 phút video cơ bản*', '30 minutes of basic video*'],
  ['40 phút video cơ bản*', '40 minutes of basic video*'],
  ['50 phút video cơ bản*', '50 minutes of basic video*'],
  ['Video AI', 'AI Video'],
  ['Voice over, avatar (hoạt hình/người thật/mua bản quyền), ngữ cảnh cụ thể, hiệu ứng âm thanh, chất lượng nhất quán', 'Voice-over, avatar (animated/real/licensed), specific context, sound effects, and consistent quality'],
  ['Không áp dụng', 'Not included'],
  ['10-15 phút tổng thời lượng', '10-15 minutes total duration'],
  ['25-30 phút tổng thời lượng', '25-30 minutes total duration'],
  ['Quiz/Test', 'Quiz/Test'],
  ['2-4 gamification', '2-4 gamification activities'],
  ['5-8 gamification', '5-8 gamification activities'],
  ['9-12 gamification', '9-12 gamification activities'],
  ['(kéo thả, đố vui...),', '(drag-and-drop, quizzes...),'],
  ['50 MCQ', '50 MCQs'],
  ['Tất cả các gói đều sử dụng phương pháp Instructional', 'All packages use Instructional'],
  ['Design để đóng gói chuẩn SCORM', 'Design methodology and SCORM packaging'],
  ['Design để đóng gói chuẩn SCORM.', 'Design methodology and SCORM packaging.'],
  ['Video cơ bản: hướng dẫn sử dụng/nội dung có voice', 'Basic video: usage/content guidance with voice'],
  ['over, cắt ghép từ nguồn có sẵn', 'over, edited from available source materials'],
  ['Triển khai hệ thống', 'System Implementation'],
  ['Từ', 'From'],
  ['Bảo mật tài sản trí tuệ', 'Protect intellectual property'],
  ['Xóa bỏ rào cản địa lý', 'Remove geographic barriers'],
  ['Tối ưu 80% nguồn lực quản trị', 'Optimize 80% of management resources'],
  ['Thiết kế độc bản toàn bộ UX/UI', 'Fully custom UX/UI design'],
  ['Chuẩn hoá giao diện theo Brand Guideline', 'Standardized interface aligned with brand guidelines'],
  ['Thiết kế bộ huy hiệu, chứng chỉ độc quyền', 'Custom badges and certificates'],
  ['Bảo hành miễn phí 24/7 trong 6 tháng đầu', 'Free 24/7 support for the first 6 months'],
  ['Bảo hành hằng năm (tính sau khi hết hạn bảo hành miễn phí)', 'Annual maintenance after the free warranty period'],
  ['Số hoá tài sản tri thức', 'Digitize knowledge assets'],
  ['Tối ưu hiệu suất đào tạo', 'Optimize training performance'],
  ['Nhân bản năng lực bằng AI', 'Replicate capabilities with AI'],
  ['Client Testimonials', 'Client Testimonials'],
  ['Nesso không chỉ cung cấp LMS mà còn mang đến tư duy quản trị đào tạo bài bản. Nhờ đó, chúng tôi tối ưu 40% chi phí đào tạo nhưng vẫn đảm bảo tính đồng bộ trên toàn hệ thống.', 'Nesso does not only provide an LMS; they bring a structured approach to training management. As a result, we optimized training costs by 40% while maintaining consistency across the entire system.'],
  ['Bà Nguyễn Phạm Minh Uyên -', 'Ms. Nguyen Pham Minh Uyen -'],
  ['Giám đốc nhân sự', 'HR Director'],
  ['Nesso giúp số hóa SOP nhanh, trực quan và chuẩn hóa vận hành hiệu quả.', 'Nesso helps digitize SOPs quickly and visually while standardizing operations effectively.'],
  ['"Nesso giúp số hóa SOP nhanh, trực quan và chuẩn hóa vận hành hiệu quả."', '"Nesso helps digitize SOPs quickly and visually while standardizing operations effectively."'],
  ['Ông Võ Anh Tuấn - Quản lý đào tạo', 'Mr. Vo Anh Tuan - Training Manager'],
  ['Chúng tôi tin tưởng Nesso trong triển khai LMS và số hóa đào tạo phục vụ mở rộng quy mô.', 'We trust Nesso to implement LMS and digitize training to support business scaling.'],
  ['"Chúng tôi tin tưởng Nesso trong triển khai LMS và số hóa đào tạo phục vụ mở rộng quy mô."', '"We trust Nesso to implement LMS and digitize training to support business scaling."'],
  ['Ông Trần Phạm Duy Khang - Giám đốc điều hành', 'Mr. Tran Pham Duy Khang - Chief Executive Officer'],
  ['Nâng tầm', 'Elevate'],
  ['doanh nghiệp của bạn', 'your business'],
  ['Nâng tầm doanh nghiệp của bạn', 'Elevate your business'],
  ['CONNECT WITH US', 'CONNECT WITH US'],
  ['Enter your email', 'Enter your email'],
  ['Đi tới trang liên hệ', 'Go to contact page'],
  ['Submit', 'Submit'],
  ['*Chúng tôi cam kết cung cấp giải pháp LMS an toàn. Bằng cách đặt an toàn dữ liệu là ưu tiên hàng đầu trong quá trình thiết kế, phát triển, triển khai và bảo trì, chúng tôi hướng tới xây dựng một hệ thống mạnh mẽ và đáng tin cậy.', '*We are committed to delivering secure LMS solutions. By making data safety a top priority throughout design, development, implementation, and maintenance, we aim to build a robust and trustworthy system.'],
  ['Bài viết của Nesso', 'Nesso Articles'],
  ['Bài viết nổi bật', 'Featured Articles'],
  ['Khám phá góc nhìn mới về LMS, thiết kế trải nghiệm học tập và chuyển đổi đào tạo cho doanh nghiệp.', 'Explore fresh perspectives on LMS, learning experience design, and enterprise training transformation.'],
  ['Danh mục Bài viết của Nesso', 'Nesso Article Categories'],
  ['Danh mục bài viết', 'Article Categories'],
  ['Tất cả bài viết', 'All Articles'],
  ['Bài viết', 'Articles'],
  ['Tìm kiếm bài viết', 'Search articles'],
  ['Tìm kiếm ...', 'Search ...'],
  ['Đang tải bài viết...', 'Loading articles...'],
  ['Chưa tìm thấy bài viết phù hợp', 'No matching articles found'],
  ['Danh mục này chưa có bài viết', 'This category has no articles yet'],
  ['Bài viết đang được cập nhật', 'Articles are being updated'],
  ['Bạn có thể thử từ khóa khác hoặc chọn một danh mục rộng hơn.', 'Try another keyword or choose a broader category.'],
  ['Nesso sẽ sớm bổ sung thêm nội dung cho chủ đề này. Hãy xem các danh mục khác trong lúc chờ bài viết mới.', 'Nesso will add more content to this topic soon. You can explore other categories while waiting for new articles.'],
  ['Nesso đang chuẩn bị các chia sẻ mới về LMS, thiết kế học tập và chuyển đổi đào tạo cho doanh nghiệp.', 'Nesso is preparing new insights on LMS, learning design, and enterprise training transformation.'],
  ['Từ nội dung tĩnh đến trải nghiệm học tập tương tác', 'From static content to interactive learning experiences'],
  ['NESSO đang chuẩn bị các bài viết chuyên sâu về LMS, thiết kế học tập và dữ liệu đào tạo.', 'NESSO is preparing in-depth articles on LMS, learning design, and training data.'],
  ['Bài nổi bật trước', 'Previous featured article'],
  ['Bài nổi bật tiếp theo', 'Next featured article'],
  ['Tổng quan', 'Overview'],
  ['Nội dung', 'Content'],
  ['Nội dung đang được cập nhật.', 'Content is being updated.'],
  ['Quay lại', 'Back'],
  ['Khám phá góc nhìn mới về hệ thống đào tạo, thiết kế trải nghiệm học tập số cho doanh nghiệp.', 'Explore fresh perspectives on training systems and digital learning experience design for your business.'],
  ['Email', 'Email'],
  ['Họ và tên', 'Full name'],
  ['Website công ty', 'Company website'],
  ['Nhu cầu tư vấn', 'Consulting need'],
  ['Hệ thống LMS', 'LMS System'],
  ['Hệ thống LMS & Chuyển đổi nội dung đào tạo', 'LMS System & Training Content Conversion'],
  ['Nội dung cần tư vấn', 'Consulting details'],
  ['Nguyễn Văn A', 'John Smith'],
  ['Bằng cách đánh dấu vào ô này, bạn đồng ý nhận tư vấn từ Nesso cũng như chấp thuận các Điều khoản Dịch vụ & Chính sách Bảo mật.', 'By checking this box, you agree to receive consultation from Nesso and accept the Terms of Service & Privacy Policy.'],
  ['Gửi thông tin', 'Submit'],
  ['Vui lòng nhập email, họ và tên và đánh dấu ô đồng ý trước khi gửi.', 'Please enter your email, full name, and check the consent box before submitting.'],
  ['Đang gửi...', 'Sending...'],
  ['Đang gửi thông tin tư vấn...', 'Sending your consultation request...'],
  ['Thông tin đã được gửi. Nesso sẽ liên hệ lại sớm.', 'Your information has been sent. Nesso will contact you soon.'],
  ['Chưa gửi được thông tin. Vui lòng thử lại sau.', 'The information could not be sent. Please try again later.'],
  ['Vòng quay may mắn Nesso', 'Nesso Lucky Wheel'],
  ['Tiến trình nhận voucher', 'Voucher claim progress'],
  ['Điền thông tin', 'Enter information'],
  ['Nhận voucher', 'Claim voucher'],
  ['Email *', 'Email *'],
  ['Họ và tên *', 'Full name *'],
  ['Tiếp tục', 'Continue'],
  ['Điều kiện áp dụng:', 'Terms of use:'],
  ['Mỗi doanh nghiệp được tham gia 01 lần.', 'Each company may participate once.'],
  ['Voucher có hiệu lực 30 ngày kể từ ngày phát hành.', 'The voucher is valid for 30 days from the issue date.'],
  ['Áp dụng cho khách hàng/doanh nghiệp đăng ký mới.', 'Applies to newly registered customers/companies.'],
  ['Không quy đổi thành tiền mặt và không áp dụng đồng thời với các chương trình ưu đãi khác.', 'Cannot be exchanged for cash and cannot be combined with other promotions.'],
  ['Demo miễn phí 10s chuyển đổi nội dung đào tạo.', 'Free 10-second demo of training content conversion.'],
  ['Trải nghiệm Demo LMS miễn phí - Sandbox.', 'Free LMS demo experience - Sandbox.'],
  ['Cam kết bảo mật', 'Privacy Commitment'],
  ['BẢO MẬT DỮ LIỆU:', 'DATA PRIVACY:'],
  ['Thông tin bạn cung cấp chỉ được dùng để NESSO liên hệ hỗ trợ và không bao giờ được chia sẻ cho bên thứ ba.', 'The information you provide is used only for NESSO to contact and support you, and is never shared with third parties.'],
  ['Vòng quay voucher Nesso', 'Nesso voucher wheel'],
  ['Bắt đầu quay', 'Start spinning'],
  ['Hoàn thành', 'Completed'],
  ['Bộ phận BD của NESSO sẽ liên hệ với bạn qua email trong thời gian sớm nhất.', 'NESSO’s BD team will contact you by email as soon as possible.'],
  ['Vui lòng điền đầy đủ họ tên, email và xác nhận đồng ý trước khi tiếp tục.', 'Please enter your full name and email, then confirm consent before continuing.'],
  ['Chúc mừng bạn đã nhận được', 'Congratulations, you received'],
  ['Voucher giảm 30% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '30% Discount Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher giảm 20% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '20% Discount Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher giảm 15% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '15% Discount Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher giảm 10% - Hệ thống LMS (Gói Standard)', '10% Discount Voucher - LMS System (Standard Package)'],
  ['Voucher 30% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '30% Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher 20% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '20% Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher 15% - Dịch vụ Chuyển đổi nội dung (Gói Standard)', '15% Voucher - Content Conversion Service (Standard Package)'],
  ['Voucher 10% - Hệ thống LMS (Gói Standard)', '10% Voucher - LMS System (Standard Package)'],
  ['Dịch vụ Chuyển đổi nội dung (Gói Standard)', 'Content Conversion Service (Standard Package)'],
  ['Hệ thống LMS (Gói Standard)', 'LMS System (Standard Package)'],
  ['Trang gửi form', 'Form page'],
  ['Tổng quan', 'Overview'],
  ['Quản lý khoá học:', 'Course management:'],
  ['Tạo và quản lý các khoá học riêng biệt', 'Create and manage dedicated courses'],
  ['Đánh giá & báo cáo:', 'Assessment & reporting:'],
  ['Giao bài tập, kiểm tra và theo dõi kết quả tự động', 'Assign learning tasks, run assessments, and track results automatically'],
  ['Trợ lý AI thông minh:', 'Smart AI assistant:'],
  ['Tích hợp AI DISC hỗ trợ phân tích và đồng hành', 'AI DISC supports analysis and learning guidance'],
  ['Liên hệ với chúng tôi', 'Contact Us'],
  ['Trải nghiệm Demo', 'Try the Demo'],
  ['Các tính năng nổi bật và nhiều hơn thế nữa...', 'Standout features and much more...'],
  ['Tính năng nổi bật', 'Featured capabilities'],
  ['Bài học bằng hình ảnh & video', 'Visual and video lessons'],
  ['Kho tri thức', 'Knowledge library'],
  ['Trợ lý AI', 'AI assistant'],
  ['Quản lý học viên', 'Learner management'],
  ['Thông báo & lời nhắc', 'Alerts and reminders'],
  ['Phân quyền', 'Role-based access'],
  ['Nền tảng tập trung vào việc học tập, tự động hoá tri thức và cá nhân hoá trải nghiệm người học.', 'A platform focused on learning, knowledge automation, and personalized learner experiences.'],
  ['Các tính năng LMS gồm Học tập, Đánh giá, Quản trị CMS, Phát triển nội dung, AI và Thương hiệu', 'LMS capabilities for learning, assessment, CMS administration, content development, AI, and branding'],
  ['Học tập', 'Learning'],
  ['Xây dựng khóa học, truyền tải nội dung và dẫn dắt người học qua từng bước trong hành trình học tập của họ.', 'Build courses, deliver learning content, and guide learners through every stage of their learning journey.'],
  ['Đánh giá', 'Assessment'],
  ['Cung cấp cho người học những phản hồi hữu ích và cung cấp cho các nhà quản lý dữ liệu cần thiết để nắm bắt hiệu quả học tập.', 'Give learners meaningful feedback while providing managers with the data needed to understand learning effectiveness.'],
  ['Quản trị CMS', 'CMS administration'],
  ['Quản lý người dùng, nhóm, quyền hạn và hoạt động đào tạo tại một nơi duy nhất.', 'Manage users, groups, permissions, and training activity in one centralized place.'],
  ['Phát triển nội dung', 'Content development'],
  ['Lưu trữ, sắp xếp và phổ biến tri thức của tổ chức bạn.', 'Store, organize, and share your organization\'s knowledge.'],
  ['Tận dụng kiến thức của AI DISC để giúp người học tìm kiếm câu trả lời, hỗ trợ quản trị viên và tạo nội dung học tập nhanh hơn.', 'Use AI DISC knowledge to help learners find answers, support administrators, and create learning content faster.'],
  ['Thương hiệu', 'Branding'],
  ['Biến hệ thống LMS thành nền tảng mang dấu ấn riêng của bạn.', 'Turn your LMS into a platform that reflects your brand.'],
  ['Thư viện khóa học và nội dung số', 'Course library and digital content'],
  ['Học tập đa phương thức, sẵn sàng cho mọi nhu cầu đào tạo', 'Multimodal learning, ready for every training need'],
  ['Khám phá chi tiết', 'Explore in detail']
]);

function normalizeNessoI18nText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

const NESSO_I18N_VI = Array.from(NESSO_I18N_EN).reduce((map, [vi, en]) => {
  const key = normalizeNessoI18nText(en);
  if (key && !map.has(key)) map.set(key, vi);
  return map;
}, new Map());
const nessoI18nTextOriginals = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
const nessoI18nAttrOriginals = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
let nessoI18nApplying = false;
let nessoI18nFrame = 0;

function getStoredNessoLanguage() {
  try {
    const stored = window.localStorage ? window.localStorage.getItem(NESSO_LANGUAGE_STORAGE_KEY) : '';
    return NESSO_LANGUAGE_SUPPORTED.has(stored) ? stored : NESSO_LANGUAGE_DEFAULT;
  } catch (error) {
    return NESSO_LANGUAGE_DEFAULT;
  }
}

function getCurrentNessoLanguage() {
  const lang = document.documentElement.getAttribute('data-nesso-language') || getStoredNessoLanguage();
  return NESSO_LANGUAGE_SUPPORTED.has(lang) ? lang : NESSO_LANGUAGE_DEFAULT;
}

function preserveNessoI18nWhitespace(original, translated) {
  const source = String(original || '');
  const leading = source.match(/^\s*/)[0] || '';
  const trailing = source.match(/\s*$/)[0] || '';
  return `${leading}${translated}${trailing}`;
}

function getNessoI18nValue(original, lang) {
  const normalized = normalizeNessoI18nText(original);
  if (!normalized) return original;
  if (lang === 'en' && NESSO_I18N_EN.has(normalized)) {
    return preserveNessoI18nWhitespace(original, NESSO_I18N_EN.get(normalized));
  }
  if (lang === 'vi' && NESSO_I18N_VI.has(normalized)) {
    return preserveNessoI18nWhitespace(original, NESSO_I18N_VI.get(normalized));
  }
  return original;
}

function shouldSkipNessoI18nNode(node) {
  const element = node && (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement);
  return !element || Boolean(element.closest('script, style, svg, noscript, template, [data-nesso-i18n-skip]'));
}

function applyNessoLanguage(lang = getStoredNessoLanguage()) {
  if (!NESSO_LANGUAGE_SUPPORTED.has(lang) || !document.body) return;
  nessoI18nApplying = true;

  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-nesso-language', lang);
  document.documentElement.classList.toggle('nesso-lang-en', lang === 'en');
  document.documentElement.classList.toggle('nesso-lang-vi', lang === 'vi');

  const docCopy = NESSO_DOCUMENT_COPY[lang] || NESSO_DOCUMENT_COPY.vi;
  if (docCopy.title) document.title = docCopy.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && docCopy.description) description.setAttribute('content', docCopy.description);

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (shouldSkipNessoI18nNode(node)) return NodeFilter.FILTER_REJECT;
      return normalizeNessoI18nText(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    if (!nessoI18nTextOriginals) return;
    if (!nessoI18nTextOriginals.has(node)) nessoI18nTextOriginals.set(node, node.nodeValue);
    const original = nessoI18nTextOriginals.get(node);
    const translated = getNessoI18nValue(original, lang);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  });

  document.body.querySelectorAll('[placeholder], [aria-label], [title], [alt]').forEach(element => {
    if (shouldSkipNessoI18nNode(element) || !nessoI18nAttrOriginals) return;
    let originals = nessoI18nAttrOriginals.get(element);
    if (!originals) {
      originals = {};
      nessoI18nAttrOriginals.set(element, originals);
    }
    ['placeholder', 'aria-label', 'title', 'alt'].forEach(attr => {
      const current = element.getAttribute(attr);
      if (!current) return;
      if (!Object.prototype.hasOwnProperty.call(originals, attr)) originals[attr] = current;
      const translated = getNessoI18nValue(originals[attr], lang);
      if (current !== translated) element.setAttribute(attr, translated);
    });
  });

  applyNessoLmsFeaturesMediaLanguage(lang);
  updateNessoLanguageControls(lang);
  nessoI18nApplying = false;
}

function scheduleNessoLanguageApply() {
  if (nessoI18nApplying || nessoI18nFrame) return;
  nessoI18nFrame = window.requestAnimationFrame(() => {
    nessoI18nFrame = 0;
    applyNessoLanguage(getCurrentNessoLanguage());
  });
}

function updateNessoLanguageControls(lang) {
  const safeLang = NESSO_LANGUAGE_SUPPORTED.has(lang) ? lang : NESSO_LANGUAGE_DEFAULT;
  document.querySelectorAll('[data-lang-option]').forEach(button => {
    const isActive = button.getAttribute('data-lang-option') === safeLang;
    button.classList.toggle('header__language-option--active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function syncNessoLanguageControlImmediately(lang) {
  if (!NESSO_LANGUAGE_SUPPORTED.has(lang)) return;
  updateNessoLanguageControls(lang);
}

function isNessoLanguageDropdownMode() {
  return window.matchMedia && window.matchMedia('(min-width: 769px)').matches;
}

function setNessoLanguageDropdownOpen(toggle, isOpen) {
  if (!toggle) return;
  toggle.classList.toggle('header__language-toggle--open', Boolean(isOpen && isNessoLanguageDropdownMode()));
}

function closeNessoLanguageDropdowns() {
  document.querySelectorAll('[data-lang-toggle].header__language-toggle--open').forEach(toggle => {
    setNessoLanguageDropdownOpen(toggle, false);
  });
}

function setNessoLanguage(lang) {
  if (!NESSO_LANGUAGE_SUPPORTED.has(lang)) return;
  try {
    window.localStorage && window.localStorage.setItem(NESSO_LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {}
  applyNessoLanguage(lang);
  try {
    window.dispatchEvent(new CustomEvent('nesso-lms-language-change', {
      detail: { language: lang }
    }));
  } catch (error) {}
  if (typeof sendNessoLmsHeight === 'function') {
    window.setTimeout(sendNessoLmsHeight, 0);
    window.setTimeout(sendNessoLmsHeight, 160);
  }
}

function initNessoLanguageControls(root = document) {
  root.querySelectorAll('[data-lang-option]').forEach(button => {
    if (button.getAttribute('data-lang-bound') === '1') return;
    button.setAttribute('data-lang-bound', '1');
    button.addEventListener('pointerdown', () => {
      if (!isNessoLanguageDropdownMode()) {
        syncNessoLanguageControlImmediately(button.getAttribute('data-lang-option') || NESSO_LANGUAGE_DEFAULT);
      }
    });
    button.addEventListener('click', event => {
      event.preventDefault();
      const nextLang = button.getAttribute('data-lang-option') || NESSO_LANGUAGE_DEFAULT;
      const toggle = button.closest('[data-lang-toggle]');
      const isActive = button.classList.contains('header__language-option--active')
        || button.getAttribute('aria-pressed') === 'true';
      if (isNessoLanguageDropdownMode() && isActive && toggle && !toggle.classList.contains('header__language-toggle--open')) {
        setNessoLanguageDropdownOpen(toggle, true);
        return;
      }
      syncNessoLanguageControlImmediately(nextLang);
      setNessoLanguage(nextLang);
      setNessoLanguageDropdownOpen(toggle, false);
      button.blur();
    });
  });

  if (!document.documentElement.hasAttribute('data-lang-dropdown-bound')) {
    document.documentElement.setAttribute('data-lang-dropdown-bound', '1');
    document.addEventListener('pointerdown', event => {
      document.querySelectorAll('[data-lang-toggle].header__language-toggle--open').forEach(toggle => {
        if (!toggle.contains(event.target)) setNessoLanguageDropdownOpen(toggle, false);
      });
    });
    window.addEventListener('resize', () => {
      if (!isNessoLanguageDropdownMode()) closeNessoLanguageDropdowns();
    });
  }
}

function initNessoLanguageRuntime() {
  initNessoLanguageControls();
  applyNessoLanguage(getStoredNessoLanguage());

  if ('MutationObserver' in window && document.body) {
    const observer = new MutationObserver(() => {
      if (!nessoI18nApplying) scheduleNessoLanguageApply();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'aria-label', 'title', 'alt']
    });
  }
}

document.addEventListener('DOMContentLoaded', initNessoLanguageRuntime);
window.nessoLmsSetLanguage = setNessoLanguage;
window.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'NESSO_LANGUAGE_CHANGE') return;
  setNessoLanguage(event.data.language || NESSO_LANGUAGE_DEFAULT);
});
document.documentElement.classList.add(isInIframe ? 'nesso-lms-iframe-context' : 'nesso-lms-standalone-context');
if (isParentHeaderManaged) {
  document.documentElement.classList.add('nesso-lms-parent-header-context');
}
const nessoLmsParentDemoFrameState = {
  active: false,
  frameElement: null,
  frameStyles: null,
  htmlStyles: null,
  bodyStyles: null,
  wrapElement: null,
  wrapStyles: null
};

function getNessoLmsViewMode() {
  if (document.body && document.body.classList.contains('demo-embed-mode')) {
    return 'demo';
  }

  if (document.body && document.body.classList.contains('proposal-mode')) {
    return 'proposal';
  }

  if (document.body && document.body.classList.contains('blog-mode')) {
    return 'blog';
  }

  if (document.body && document.body.classList.contains('contact-mode')) {
    return 'contact';
  }

  if (document.body && document.body.classList.contains('lms-features-mode')) {
    return 'features';
  }

  if (document.body && document.body.classList.contains('lms-feature-details-mode')) {
    return 'feature-details';
  }

  if (document.body && document.body.classList.contains('lucky-mode')) {
    return 'lucky';
  }

  if (document.body && document.body.classList.contains('image-route-mode')) {
    return 'image';
  }

  return 'landing';
}

function getNessoLmsViewportHeight() {
  const doc = document.documentElement;
  return Math.ceil(window.innerHeight || (doc ? doc.clientHeight : 0) || 0);
}

function getNessoLmsEmbedViewportFloor() {
  const ownViewportHeight = getNessoLmsViewportHeight();

  if (!isInIframe) {
    return ownViewportHeight;
  }

  try {
    const parentViewportHeight = window.parent && window.parent !== window
      ? Math.ceil(window.parent.innerHeight || 0)
      : 0;

    if (parentViewportHeight > 0) {
      return Math.min(ownViewportHeight || parentViewportHeight, parentViewportHeight);
    }
  } catch (e) {}

  return Math.min(ownViewportHeight, 1200);
}

let lastNessoLmsSentHeight = 0;
let lastNessoLmsSentMode = '';

function getNessoLmsDocumentBottom(selector) {
  const element = document.querySelector(selector);
  if (!element) return 0;

  const rect = element.getBoundingClientRect();
  if (!rect || !Number.isFinite(rect.height)) return 0;

  return Math.ceil(window.scrollY + rect.top + rect.height);
}

function getNessoLmsVisiblePageChildrenBottom() {
  const page = document.querySelector('.page');
  if (!page || !page.children) return 0;

  return Array.prototype.reduce.call(page.children, (maxBottom, child) => {
    if (!child || child.hidden) return maxBottom;

    const styles = window.getComputedStyle ? window.getComputedStyle(child) : null;
    if (styles && (styles.display === 'none' || styles.visibility === 'hidden')) {
      return maxBottom;
    }

    const rect = child.getBoundingClientRect();
    if (!rect || !Number.isFinite(rect.height) || rect.height <= 0) {
      return maxBottom;
    }

    return Math.max(maxBottom, Math.ceil(window.scrollY + rect.top + rect.height));
  }, 0);
}

function getNessoLmsPageEmbedHeight() {
  const page = document.querySelector('.page');
  const pageRect = page ? page.getBoundingClientRect() : null;
  const pageHeight = pageRect && Number.isFinite(pageRect.height) ? Math.ceil(pageRect.height) : 0;
  const pageBottom = pageRect && Number.isFinite(pageRect.bottom)
    ? Math.ceil(window.scrollY + pageRect.bottom)
    : 0;
  const visibleChildrenBottom = getNessoLmsVisiblePageChildrenBottom();

  if (page) {
    return Math.ceil(Math.max(
      pageHeight,
      pageBottom,
      visibleChildrenBottom,
      getNessoLmsEmbedViewportFloor()
    ));
  }

  const body = document.body;
  const doc = document.documentElement;

  return Math.ceil(Math.max(
    body ? body.offsetHeight : 0,
    body ? body.scrollHeight : 0,
    doc ? doc.offsetHeight : 0,
    doc ? doc.scrollHeight : 0,
    getNessoLmsEmbedViewportFloor()
  ));
}

function getNessoLmsBlogEmbedHeight() {
  return Math.max(
    getNessoLmsDocumentBottom('.header'),
    getNessoLmsDocumentBottom('#blog-view'),
    getNessoLmsDocumentBottom('.cta-footer-wrapper')
  );
}

function getNessoLmsContactEmbedHeight() {
  return Math.max(
    getNessoLmsDocumentBottom('.header'),
    getNessoLmsDocumentBottom('#contact-view'),
    getNessoLmsDocumentBottom('.cta-footer-wrapper')
  );
}

function getNessoLmsLuckyEmbedHeight() {
  return Math.max(
    getNessoLmsDocumentBottom('.header'),
    getNessoLmsDocumentBottom('#lucky-wheel-view'),
    getNessoLmsDocumentBottom('.cta-footer-wrapper')
  );
}

function getNessoLmsFeaturesEmbedHeight() {
  return Math.max(
    getNessoLmsDocumentBottom('.header'),
    getNessoLmsDocumentBottom('#lms-features-view'),
    getNessoLmsDocumentBottom('.cta-footer-wrapper')
  );
}

function getNessoLmsInlineStyles(element, properties) {
  if (!element) return null;

  return properties.reduce((styles, property) => {
    styles[property] = {
      value: element.style.getPropertyValue(property),
      priority: element.style.getPropertyPriority(property)
    };
    return styles;
  }, {});
}

function restoreNessoLmsInlineStyles(element, styles) {
  if (!element || !styles) return;

  Object.keys(styles).forEach(property => {
    const item = styles[property];
    if (item && item.value) {
      element.style.setProperty(property, item.value, item.priority || '');
    } else {
      element.style.removeProperty(property);
    }
  });
}

function setNessoLmsImportantStyle(element, property, value) {
  if (!element) return;
  element.style.setProperty(property, value, 'important');
}

function getNessoLmsParentViewportHeight() {
  try {
    return Math.ceil(window.parent.innerHeight || window.innerHeight || 0);
  } catch (e) {
    return getNessoLmsViewportHeight();
  }
}

function setNessoLmsParentDemoFrameMode(isActive) {
  if (!isInIframe) return false;

  try {
    const frameElement = window.frameElement;
    const parentDocument = window.parent && window.parent.document;
    if (!frameElement || !parentDocument) return false;

    const html = parentDocument.documentElement;
    const body = parentDocument.body;
    const wrapElement = frameElement.parentElement;
    const frameProperties = [
      'position',
      'inset',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'width',
      'max-width',
      'height',
      'min-height',
      'margin'
    ];
    const documentProperties = ['overflow', 'height'];
    const wrapProperties = ['overflow'];

    if (isActive) {
      if (!nessoLmsParentDemoFrameState.active) {
        nessoLmsParentDemoFrameState.active = true;
        nessoLmsParentDemoFrameState.frameElement = frameElement;
        nessoLmsParentDemoFrameState.wrapElement = wrapElement;
        nessoLmsParentDemoFrameState.frameStyles = getNessoLmsInlineStyles(frameElement, frameProperties);
        nessoLmsParentDemoFrameState.htmlStyles = getNessoLmsInlineStyles(html, documentProperties);
        nessoLmsParentDemoFrameState.bodyStyles = getNessoLmsInlineStyles(body, documentProperties);
        nessoLmsParentDemoFrameState.wrapStyles = getNessoLmsInlineStyles(wrapElement, wrapProperties);
      }

      const parentHeight = getNessoLmsParentViewportHeight();
      setNessoLmsImportantStyle(frameElement, 'position', 'fixed');
      setNessoLmsImportantStyle(frameElement, 'inset', '0');
      setNessoLmsImportantStyle(frameElement, 'top', '0');
      setNessoLmsImportantStyle(frameElement, 'right', '0');
      setNessoLmsImportantStyle(frameElement, 'bottom', '0');
      setNessoLmsImportantStyle(frameElement, 'left', '0');
      setNessoLmsImportantStyle(frameElement, 'z-index', '2147483000');
      setNessoLmsImportantStyle(frameElement, 'display', 'block');
      setNessoLmsImportantStyle(frameElement, 'width', '100vw');
      setNessoLmsImportantStyle(frameElement, 'max-width', 'none');
      setNessoLmsImportantStyle(frameElement, 'height', `${parentHeight}px`);
      setNessoLmsImportantStyle(frameElement, 'min-height', `${parentHeight}px`);
      setNessoLmsImportantStyle(frameElement, 'margin', '0');
      setNessoLmsImportantStyle(html, 'overflow', 'hidden');
      setNessoLmsImportantStyle(body, 'overflow', 'hidden');
      setNessoLmsImportantStyle(html, 'height', '100%');
      setNessoLmsImportantStyle(body, 'height', '100%');
      setNessoLmsImportantStyle(wrapElement, 'overflow', 'visible');
      return true;
    }

    if (!nessoLmsParentDemoFrameState.active) return false;

    restoreNessoLmsInlineStyles(
      nessoLmsParentDemoFrameState.frameElement || frameElement,
      nessoLmsParentDemoFrameState.frameStyles
    );
    restoreNessoLmsInlineStyles(html, nessoLmsParentDemoFrameState.htmlStyles);
    restoreNessoLmsInlineStyles(body, nessoLmsParentDemoFrameState.bodyStyles);
    restoreNessoLmsInlineStyles(
      nessoLmsParentDemoFrameState.wrapElement || wrapElement,
      nessoLmsParentDemoFrameState.wrapStyles
    );

    nessoLmsParentDemoFrameState.active = false;
    nessoLmsParentDemoFrameState.frameElement = null;
    nessoLmsParentDemoFrameState.frameStyles = null;
    nessoLmsParentDemoFrameState.htmlStyles = null;
    nessoLmsParentDemoFrameState.bodyStyles = null;
    nessoLmsParentDemoFrameState.wrapElement = null;
    nessoLmsParentDemoFrameState.wrapStyles = null;
    return true;
  } catch (e) {
    return false;
  }
}

function getNessoLmsEmbedHeight() {
  const mode = getNessoLmsViewMode();

  if (mode === 'demo' || mode === 'image') {
    return getNessoLmsViewportHeight();
  }

  if (mode === 'blog') {
    const blogHeight = getNessoLmsBlogEmbedHeight();
    if (blogHeight > 0) {
      return blogHeight;
    }
  }

  if (mode === 'contact') {
    const contactHeight = getNessoLmsContactEmbedHeight();
    if (contactHeight > 0) {
      return contactHeight;
    }
  }

  if (mode === 'features') {
    const featuresHeight = getNessoLmsFeaturesEmbedHeight();
    if (featuresHeight > 0) {
      return featuresHeight;
    }
  }

  if (mode === 'lucky') {
    const luckyHeight = getNessoLmsLuckyEmbedHeight();
    if (luckyHeight > 0) {
      return luckyHeight;
    }
  }

  return getNessoLmsPageEmbedHeight();
}

function sendNessoLmsHeight() {
  if (!isInIframe) return;

  const nextMode = getNessoLmsViewMode();
  const nextHeight = getNessoLmsEmbedHeight();

  if (!nextHeight || !Number.isFinite(nextHeight)) return;

  if (
    nextMode !== 'demo' &&
    nextMode === lastNessoLmsSentMode &&
    Math.abs(nextHeight - lastNessoLmsSentHeight) < 2
  ) {
    return;
  }

  lastNessoLmsSentHeight = nextHeight;
  lastNessoLmsSentMode = nextMode;

  if (nextMode === 'demo') {
    setNessoLmsParentDemoFrameMode(true);
  }

  window.parent.postMessage({
    type: 'NESSO_LMS_HEIGHT',
    height: nextHeight,
    mode: nextMode
  }, '*');
}

function notifyNessoLmsDemoClosed() {
  if (!isInIframe) return;

  window.parent.postMessage({
    type: 'NESSO_DEMO_CLOSED'
  }, '*');
}

function notifyNessoLmsHomeTop() {
  if (!isInIframe) return;

  window.parent.postMessage({
    type: 'NESSO_CHILD_HOME_TOP'
  }, '*');
}

function scheduleNessoLmsHeightSync() {
  if (!isInIframe) return;
  sendNessoLmsHeight();
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(sendNessoLmsHeight);
  });
  [80, 160, 320, 700, 1200, 2200, 3600, 5200, 7600, 10000].forEach(delay => {
    window.setTimeout(sendNessoLmsHeight, delay);
  });
}

function clearNessoLmsDemoRoute() {
  if (!window.history || !window.history.replaceState) return;

  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('demo');
    if (String(url.searchParams.get('open') || '').toLowerCase() === 'demo') {
      url.searchParams.delete('open');
    }
    if (url.hash === '#demo' || url.hash === '#demo-embed') {
      url.hash = '';
    }
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  } catch (e) {}
}

/* --- Smooth Scroll (Lenis-style lerp) — desktop local scroll surfaces --- */
(function() {
  if (window.matchMedia('(max-width: 1024px)').matches) return;

  let current = window.scrollY;
  let target = window.scrollY;
  let smoothEase = 0.08;
  const wheelEase = 0.08;
  const precisionEase = 0.12;
  const smoothDebug = /(?:[?&]scrollDebug=1\b|#.*scrollDebug=1)/.test(window.location.href);
  let lastDebugAt = 0;
  let lastWheelTime = 0;
  let lastWheelMagnitude = 0;
  let lastHandledWheelEvent = null;

  try {
    document.documentElement.style.setProperty('scroll-behavior', 'auto', 'important');
  } catch (e) {}

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getMaxScrollY() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function clampScrollY(scrollY) {
    return Math.max(0, Math.min(scrollY, getMaxScrollY()));
  }

  function normalizeWheelDeltaY(deltaY, deltaMode) {
    const nextDelta = Number(deltaY) || 0;
    if (deltaMode === 1) return nextDelta * 42;
    if (deltaMode === 2) return nextDelta * Math.max(1, window.innerHeight);
    return nextDelta;
  }

  function getWheelProfile(event, normalizedDeltaY) {
    const absY = Math.abs(normalizedDeltaY);
    const absX = Math.abs(Number(event.deltaX) || 0);
    const now = performance.now();
    const timeSinceLastWheel = now - lastWheelTime;
    const previousMagnitude = lastWheelMagnitude;

    lastWheelTime = now;
    lastWheelMagnitude = absY;

    if (Number(event.deltaMode) !== 0) return 'wheel';
    if (absX > 0.5) return 'precision';
    if (!Number.isInteger(Number(event.deltaY))) return 'precision';
    if (absY > 0 && absY < 48) return 'precision';
    if (timeSinceLastWheel > 0 && timeSinceLastWheel < 18 && absY < 140 && previousMagnitude < 140) return 'precision';
    return 'wheel';
  }

  function debugSmoothScroll(reason, data) {
    if (!smoothDebug) return;
    const now = performance.now();
    if (now - lastDebugAt < 120) return;
    lastDebugAt = now;
    console.log('[NESSO smooth]', reason, data || {});
  }

  if (smoothDebug) {
    window.setTimeout(function() {
      console.log('[NESSO smooth] init', {
        inIframe: isInIframe,
        parentHeaderManaged: isParentHeaderManaged,
        width: window.innerWidth,
        scrollY: Math.round(window.scrollY),
        bodyClass: document.body ? document.body.className : ''
      });
    }, 320);
  }

  function shouldUseLocalSmoothScroll() {
    if (!document.body || document.body.classList.contains('demo-embed-mode')) return false;

    if (isInIframe) {
      return document.body.classList.contains('proposal-mode')
        || document.body.classList.contains('blog-mode')
        || document.body.classList.contains('contact-mode')
        || document.body.classList.contains('lms-features-mode')
        || document.body.classList.contains('lms-feature-details-mode')
        || document.body.classList.contains('lucky-mode');
    }

    return true;
  }

  function syncSmoothStateToWindow() {
    current = window.scrollY;
    target = window.scrollY;
  }

  function applyLocalSmoothWheel(deltaY, deltaMode, wheelProfile) {
    if (!shouldUseLocalSmoothScroll()) return false;

    const nextDelta = normalizeWheelDeltaY(deltaY, deltaMode);
    if (Math.abs(nextDelta) < 1) return false;

    const deltaMultiplier = wheelProfile === 'precision' ? 1.12 : 1;
    smoothEase = wheelProfile === 'precision' ? precisionEase : wheelEase;
    target = clampScrollY(target + (nextDelta * deltaMultiplier));
    return true;
  }

  function update() {
    if (!shouldUseLocalSmoothScroll()) {
      syncSmoothStateToWindow();
      requestAnimationFrame(update);
      return;
    }

    target = clampScrollY(target);
    current = lerp(current, target, smoothEase);
    if (Math.abs(current - target) < 0.5) current = target;
    window.scrollTo({ top: current, left: 0, behavior: 'auto' });
    requestAnimationFrame(update);
  }

  function handleLocalSmoothWheel(e) {
    if (e === lastHandledWheelEvent) return;

    const normalizedDeltaY = normalizeWheelDeltaY(e.deltaY, e.deltaMode);
    if (Math.abs(normalizedDeltaY) < 1) return;

    const wheelProfile = getWheelProfile(e, normalizedDeltaY);

    if (!shouldUseLocalSmoothScroll()) {
      debugSmoothScroll('wheel skipped', {
        inIframe: isInIframe,
        parentHeaderManaged: isParentHeaderManaged,
        bodyClass: document.body ? document.body.className : '',
        width: window.innerWidth
      });
      return;
    }

    if (e.cancelable === false) {
      debugSmoothScroll('wheel not cancelable', {
        profile: wheelProfile,
        deltaY: Math.round(normalizedDeltaY * 100) / 100
      });
      return;
    }

    e.preventDefault();
    lastHandledWheelEvent = e;
    if (applyLocalSmoothWheel(e.deltaY, e.deltaMode, wheelProfile)) {
      debugSmoothScroll('wheel captured', {
        mode: document.body.className,
        profile: wheelProfile,
        deltaY: Math.round(normalizedDeltaY * 100) / 100,
        current: Math.round(current),
        target: Math.round(target)
      });
    }
  }

  document.addEventListener('wheel', handleLocalSmoothWheel, { passive: false, capture: true });
  window.addEventListener('wheel', handleLocalSmoothWheel, { passive: false });

  window.addEventListener('message', function(event) {
    if (!event.data || event.data.type !== 'NESSO_PARENT_SURFACE_WHEEL') return;
    const mode = String(event.data.mode || '');
    if (mode && mode !== 'blog' && mode !== 'contact' && mode !== 'lucky') return;
    applyLocalSmoothWheel(event.data.deltaY, Number(event.data.deltaMode) || 0, 'wheel');
  });

  window.addEventListener('scroll', function() {
    if (Math.abs(current - window.scrollY) > 2) {
      syncSmoothStateToWindow();
    }
  });

  requestAnimationFrame(update);
})();

/* --- Iframe → Parent: send height --- */
if (isInIframe) {
  const nessoHeightSyncedMedia = typeof WeakSet !== 'undefined' ? new WeakSet() : null;

  function bindNessoLmsMediaHeightSync(root = document) {
    if (!root || !root.querySelectorAll) return;

    root.querySelectorAll('img, video, iframe').forEach(media => {
      if (nessoHeightSyncedMedia && nessoHeightSyncedMedia.has(media)) return;
      if (nessoHeightSyncedMedia) nessoHeightSyncedMedia.add(media);

      media.addEventListener('load', scheduleNessoLmsHeightSync, { passive: true });
      media.addEventListener('error', scheduleNessoLmsHeightSync, { passive: true });
      if (media.tagName === 'VIDEO') {
        media.addEventListener('loadedmetadata', scheduleNessoLmsHeightSync, { passive: true });
        media.addEventListener('loadeddata', scheduleNessoLmsHeightSync, { passive: true });
      }
    });
  }

  window.addEventListener('message', event => {
    if (!event.data || event.data.type !== 'NESSO_PARENT_REQUEST_HEIGHT') return;
    scheduleNessoLmsHeightSync();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.querySelector('.page');
    bindNessoLmsMediaHeightSync(page || document);
    scheduleNessoLmsHeightSync();

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(scheduleNessoLmsHeightSync);
      if (page) resizeObserver.observe(page);
      if (document.body) resizeObserver.observe(document.body);
      if (document.documentElement) resizeObserver.observe(document.documentElement);
    }

    if ('MutationObserver' in window && (page || document.body)) {
      const mutationObserver = new MutationObserver(() => {
        bindNessoLmsMediaHeightSync(page || document);
        scheduleNessoLmsHeightSync();
      });
      mutationObserver.observe(page || document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style', 'hidden', 'src']
      });
    }
  });

  window.addEventListener('load', scheduleNessoLmsHeightSync);
  window.addEventListener('pageshow', scheduleNessoLmsHeightSync);
  window.addEventListener('resize', scheduleNessoLmsHeightSync);
  window.addEventListener('orientationchange', scheduleNessoLmsHeightSync);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleNessoLmsHeightSync);
    window.visualViewport.addEventListener('scroll', scheduleNessoLmsHeightSync);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleNessoLmsHeightSync).catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const proposalView = document.querySelector('#proposal-view');
  const proposalOpenTriggers = document.querySelectorAll('[data-proposal-open]');
  const proposalFooterToggle = document.querySelector('[data-proposal-footer-toggle]');
  const blogView = document.querySelector('#blog-view');
  const lmsFeaturesView = document.querySelector('#lms-features-view');
  const lmsFeatureDetailsView = document.querySelector('#lms-feature-details-view');
  const lmsFeatureTimelineAsset = 'https://nesso.vn/wp-content/uploads/2026/09/icon-straigh-line-each-rows-in-section.png';

  if (lmsFeatureDetailsView) {
    lmsFeatureDetailsView.querySelectorAll('.lms-feature-details-section__media img').forEach(image => {
      image.loading = 'eager';
    });

    lmsFeatureDetailsView.querySelectorAll('.lms-feature-details-rows').forEach(rows => {
      rows.querySelector('.lms-feature-details-rows__line')?.remove();

      rows.querySelectorAll('.lms-feature-details-row').forEach(row => {
        const rowIcon = row.querySelector(':scope > img:not(.lms-feature-details-row__timeline)');
        if (rowIcon) rowIcon.classList.add('lms-feature-details-row__icon');

        if (row.querySelector('.lms-feature-details-row__timeline')) return;

        const timeline = document.createElement('img');
        timeline.className = 'lms-feature-details-row__timeline';
        timeline.src = lmsFeatureTimelineAsset;
        timeline.alt = '';
        timeline.setAttribute('aria-hidden', 'true');
        timeline.loading = 'lazy';
        timeline.decoding = 'async';
        row.prepend(timeline);
      });
    });
  }

  const lmsFeaturesRevealTargets = lmsFeaturesView
    ? [
        ...lmsFeaturesView.querySelectorAll('.lms-features-hero__content > *'),
        lmsFeaturesView.querySelector('.lms-features-grid-section__intro'),
        ...lmsFeaturesView.querySelectorAll('.lms-features-grid-card'),
        lmsFeaturesView.querySelector('.lms-features-library__card')
      ].filter(Boolean)
    : [];
  let lmsFeaturesRevealObserver = null;
  let lmsFeaturesRevealFrame = 0;
  const lmsFeatureDetailsRevealTargets = lmsFeatureDetailsView
    ? [
        ...lmsFeatureDetailsView.querySelectorAll('.lms-feature-details-hero__copy > *'),
        lmsFeatureDetailsView.querySelector('.lms-feature-details-hero__visual'),
        lmsFeatureDetailsView.querySelector('.lms-feature-details-discovery__inner'),
        ...lmsFeatureDetailsView.querySelectorAll('.lms-feature-details-section__media, .lms-feature-details-section__content'),
        lmsFeatureDetailsView.querySelector('.lms-feature-details-outro')
      ].filter(Boolean)
    : [];
  let lmsFeatureDetailsRevealObserver = null;
  let lmsFeatureDetailsRevealFrame = 0;
  let lmsFeatureDetailsFilterLastScrollY = 0;
  let lmsFeatureDetailsFilterHeaderHidden = false;
  let lmsFeatureDetailsScrollAnimationFrame = 0;
  const blogOpenTriggers = document.querySelectorAll('[data-blog-open]');
  const homeOpenTriggers = document.querySelectorAll('[data-home-open]');
  const lmsFeatureTriggers = document.querySelectorAll('[data-lms-features]');
  const lmsFeatureDetailsTriggers = document.querySelectorAll('[data-lms-feature-details]');
  const lmsFeatureDetailsFilters = lmsFeatureDetailsView
    ? lmsFeatureDetailsView.querySelectorAll('[data-lms-feature-filter]')
    : [];
  const lmsFeatureDetailsFilterBar = lmsFeatureDetailsView
    ? lmsFeatureDetailsView.querySelector('.lms-feature-details-filters')
    : null;
  const lmsFeatureDetailsList = lmsFeatureDetailsView
    ? lmsFeatureDetailsView.querySelector('.lms-feature-details-list')
    : null;
  const contactView = document.querySelector('#contact-view');
  const luckyWheelView = document.querySelector('#lucky-wheel-view');
  const imageRouteView = document.querySelector('#image-route-view');
  const imageRouteMobileSource = imageRouteView ? imageRouteView.querySelector('[data-image-route-mobile]') : null;
  const imageRouteImg = imageRouteView ? imageRouteView.querySelector('[data-image-route-img]') : null;
  const contactOpenTriggers = document.querySelectorAll('[data-contact-open]');
  const luckyOpenTriggers = document.querySelectorAll('[data-lucky-open]');
  const contactSelects = document.querySelectorAll('[data-contact-select]');
  const contactForm = document.querySelector('[data-contact-form]');
  const blogCategoriesRoot = document.querySelector('[data-blog-categories]');
  const blogGrid = document.querySelector('[data-blog-grid]');
  const blogStatus = document.querySelector('[data-blog-status]');
  const blogArticle = document.querySelector('[data-blog-article]');
  const blogFeatured = document.querySelector('[data-blog-featured]');
  const blogSearchInput = document.querySelector('[data-blog-search]');
  const blogPostsLayout = blogView ? blogView.querySelector('.blog-view__posts-layout') : null;
  const blogSidebar = blogView ? blogView.querySelector('.blog-view__sidebar') : null;
  const demoOpenTriggers = document.querySelectorAll('[data-demo-open]');
  const demoEmbedSection = document.querySelector('#demo-embed-section');
  const demoEmbedFrame = document.querySelector('[data-demo-embed-frame]');
  const demoIframeTemplate = document.querySelector('#landa-demo-iframe-template');
  const demoCloseTriggers = document.querySelectorAll('[data-demo-close]');
  const header = document.querySelector('#header');
  const headerLogo = document.querySelector('.header__logo');
  const headerNav = document.querySelector('[data-header-nav]');
  const headerMenuToggle = document.querySelector('[data-header-menu-toggle]');
  const proposalSlides = proposalView ? Array.from(proposalView.querySelectorAll('[data-proposal-slide]')) : [];
  const proposalMenu = proposalView ? proposalView.querySelector('.proposal-view__menu') : null;
  const proposalMenuLinks = proposalView ? Array.from(proposalView.querySelectorAll('[data-proposal-menu-link]')) : [];
  const proposalCurrent = proposalView ? proposalView.querySelector('[data-proposal-current]') : null;
  const proposalScrollAnchor = proposalView ? proposalView.querySelector('.proposal-view__image-wrap') : null;
  const proposalVideoFrame = proposalView ? proposalView.querySelector('[data-proposal-video-frame]') : null;
  const proposalFooter = document.querySelector('.cta-footer-wrapper');
  const proposalVirtualScrollQuery = window.matchMedia('(min-width: 1025px)');
  const proposalSlideLockMs = 240;
  let activeProposalSlide = 0;
  let proposalSlideLocked = false;
  let proposalTouchStartX = 0;
  let proposalTouchStartY = 0;
  let parentProposalScrollY = 0;
  let parentProposalViewportH = window.innerHeight;
  let proposalScrollCaptureReady = false;
  let proposalLockScrollY = 0;
  let proposalLockTolerance = 0;
  let proposalLockAnimationFrame = 0;
  let proposalLocking = false;
  let pendingProposalScrollDirection = 0;
  let lastProposalCenterDistance = null;
  let proposalActiveAnimationFrame = 0;
  let proposalActiveThrottleTimer = 0;
  let proposalLastActiveUpdateTime = 0;
  let proposalScrollAnimationFrame = 0;
  let proposalClickScrollAnimating = false;
  let proposalScrollAnimationWindow = null;
  const proposalInstantScrollStyles = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
  let proposalMenuMetricsValid = false;
  let proposalMenuBaseTop = 0;
  let proposalMenuTrackBottom = 0;
  let proposalMenuHeight = 0;
  let proposalParentMenuManaged = false;
  let blogSidebarMetricsValid = false;
  let blogSidebarBaseTop = 0;
  let blogSidebarTrackBottom = 0;
  let blogSidebarHeight = 0;
  let stickyHeaderLastScrollY = 0;
  let stickyHeaderHidden = false;
  let stickyHeaderParentManaged = false;
  let blogParentLastScrollY = 0;
  let demoReturnScrollY = 0;
  const lmsBlogConfig = {
    apiBase: 'https://nesso.vn/wp-json/wp/v2',
    postEndpoints: ['lms_post', 'lms-posts', 'lms_posts', 'lms'],
    categoryEndpoints: ['lms_category', 'lms-categories', 'lms_categories']
  };
  const lmsBlogState = {
    loaded: false,
    loading: false,
    posts: [],
    categories: [],
    activeCategory: 'all',
    searchTerm: '',
    featuredIndex: 0,
    cacheBust: String(Date.now()),
    activeSlug: getBlogSlugFromHash()
  };

  function setHeaderNavOpen(isOpen) {
    if (!header || !headerNav || !headerMenuToggle) return;
    header.classList.toggle('header--nav-open', isOpen);
    headerMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (!isOpen && window.innerWidth > 768) {
      headerNav.removeAttribute('aria-hidden');
    } else {
      headerNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
  }

  function closeHeaderNav() {
    setHeaderNavOpen(false);
  }

  function openLandingHome(options = {}) {
    closeHeaderNav();
    const scrollBehavior = options.scrollBehavior || 'auto';
    const parentOwnsRoute = isInIframe && options.notifyParent !== false;

    if (document.body.classList.contains('demo-embed-mode')) {
      closeDemoEmbed(false);
    }

    if (document.body.classList.contains('proposal-mode')) {
      setProposalMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('blog-mode')) {
      setBlogMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('contact-mode')) {
      setContactMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('lms-features-mode')) {
      setLmsFeaturesMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('lms-feature-details-mode')) {
      setLmsFeatureDetailsMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false, { syncRoute: !parentOwnsRoute });
    }
    if (document.body.classList.contains('image-route-mode')) {
      setImageRouteMode(false, '', { syncRoute: !parentOwnsRoute });
    }

    if (parentOwnsRoute) {
      notifyNessoLmsHomeTop();
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
      notifyLayoutChange();
    });
  }

  function setStickyHeaderHidden(isHidden) {
    if (!header || stickyHeaderHidden === isHidden) return;
    stickyHeaderHidden = isHidden;
    header.classList.toggle('header--hidden', isHidden);
    if (isHidden) closeHeaderNav();
  }

  function setStickyHeaderParentManaged(isManaged, scrollY) {
    if (!header) return;

    stickyHeaderParentManaged = isManaged;
    if (isManaged) {
      header.style.top = `${Math.max(0, Math.round(scrollY || 0))}px`;
    } else {
      header.style.removeProperty('top');
    }
  }

  function updateStickyHeader(scrollY, directionDelta, options = {}) {
    if (isParentHeaderManaged && !document.body.classList.contains('proposal-mode')) return;
    if (!header || document.body.classList.contains('demo-embed-mode')) return;

    const nextScrollY = Math.max(0, Number(scrollY) || 0);
    const delta = Number.isFinite(directionDelta) && directionDelta !== 0
      ? directionDelta
      : nextScrollY - stickyHeaderLastScrollY;

    setStickyHeaderParentManaged(!!options.parentManaged, nextScrollY);

    if (nextScrollY <= 12 || delta < -0.5) {
      setStickyHeaderHidden(false);
    } else if (delta > 4 && nextScrollY > 92) {
      setStickyHeaderHidden(true);
    }

    stickyHeaderLastScrollY = nextScrollY;
  }

  function resetStickyHeader() {
    stickyHeaderLastScrollY = 0;
    setStickyHeaderParentManaged(false, 0);
    setStickyHeaderHidden(false);
  }

  function updateProposalSlide(nextIndex) {
    if (!proposalSlides.length) return;
    activeProposalSlide = Math.max(0, Math.min(nextIndex, proposalSlides.length - 1));

    proposalSlides.forEach((slide, index) => {
      const isActive = index === activeProposalSlide;
      slide.classList.toggle('proposal-view__slide--active', isActive);
      slide.dataset.slidePosition = 'active';
    });

    if (proposalCurrent) {
      proposalCurrent.textContent = String(activeProposalSlide + 1).padStart(2, '0');
    }

    proposalMenuLinks.forEach(link => {
      const linkIndex = (Number(link.dataset.proposalMenuLink) || 1) - 1;
      link.classList.toggle('proposal-view__menu-link--active', linkIndex === activeProposalSlide);
    });

    notifyProposalActiveSlide();
  }

  function notifyProposalActiveSlide() {
    if (!isInIframe) return;

    window.parent.postMessage({
      type: 'NESSO_PROPOSAL_ACTIVE',
      activeIndex: activeProposalSlide,
      total: proposalSlides.length
    }, '*');
  }

  function getProposalDocumentTop(element) {
    const rect = element.getBoundingClientRect();
    return window.scrollY + rect.top;
  }

  function getProposalViewportScrollY() {
    return window.scrollY;
  }

  function getProposalViewportHeight() {
    return window.innerHeight;
  }

  function getProposalMenuStickyTop() {
    return window.matchMedia('(max-width: 1024px)').matches ? 0 : 104;
  }

  function resetProposalMenuStickyMetrics() {
    proposalMenuMetricsValid = false;
  }

  function measureProposalMenuStickyMetrics() {
    if (!proposalMenu || !proposalView) return false;

    const track = proposalView.querySelector('.proposal-view__slide-track');
    const currentMenuY = Number.parseFloat(proposalMenu.style.getPropertyValue('--proposal-menu-y')) || 0;
    const menuRect = proposalMenu.getBoundingClientRect();
    const trackRect = track ? track.getBoundingClientRect() : null;

    proposalMenuBaseTop = window.scrollY + menuRect.top - currentMenuY;
    proposalMenuHeight = menuRect.height;
    proposalMenuTrackBottom = trackRect ? window.scrollY + trackRect.top + trackRect.height : proposalMenuBaseTop;
    proposalMenuMetricsValid = true;
    return true;
  }

  function updateProposalMenuStickyPosition() {
    if (!proposalMenu) return;

    if (isInIframe) {
      proposalMenu.style.removeProperty('--proposal-menu-y');
      resetProposalMenuStickyMetrics();
      return;
    }

    const shouldStickProposalMenu = isInIframe
      && isProposalModeActive()
      && proposalVirtualScrollQuery.matches;

    if (!shouldStickProposalMenu) {
      proposalMenu.style.removeProperty('--proposal-menu-y');
      resetProposalMenuStickyMetrics();
      return;
    }

    if (!proposalMenuMetricsValid && !measureProposalMenuStickyMetrics()) return;

    const currentMenuY = Number.parseFloat(proposalMenu.style.getPropertyValue('--proposal-menu-y')) || 0;
    const desiredY = getProposalViewportScrollY() + getProposalMenuStickyTop() - proposalMenuBaseTop;
    const maxY = Math.max(0, proposalMenuTrackBottom - proposalMenuBaseTop - proposalMenuHeight);
    const nextY = Math.max(0, Math.min(desiredY, maxY));

    if (Math.abs(nextY - currentMenuY) >= 1) {
      proposalMenu.style.setProperty('--proposal-menu-y', `${Math.round(nextY)}px`);
    }
  }

  function getBlogSidebarStickyTop() {
    return window.matchMedia('(max-width: 1024px)').matches ? 0 : 112;
  }

  function resetBlogSidebarStickyMetrics() {
    blogSidebarMetricsValid = false;
    if (blogSidebar) {
      blogSidebar.style.removeProperty('--blog-sidebar-y');
    }
  }

  function measureBlogSidebarStickyMetrics() {
    if (!blogSidebar || !blogPostsLayout) return false;

    const currentSidebarY = Number.parseFloat(blogSidebar.style.getPropertyValue('--blog-sidebar-y')) || 0;
    const sidebarRect = blogSidebar.getBoundingClientRect();
    const layoutRect = blogPostsLayout.getBoundingClientRect();

    blogSidebarBaseTop = window.scrollY + sidebarRect.top - currentSidebarY;
    blogSidebarHeight = sidebarRect.height;
    blogSidebarTrackBottom = window.scrollY + layoutRect.top + layoutRect.height;
    blogSidebarMetricsValid = true;
    return true;
  }

  function updateBlogSidebarStickyPosition() {
    if (!blogSidebar || !blogPostsLayout) return;

    const shouldUseParentSticky = isInIframe
      && document.body.classList.contains('blog-mode')
      && window.matchMedia('(min-width: 1025px)').matches;

    if (!shouldUseParentSticky) {
      resetBlogSidebarStickyMetrics();
      return;
    }

    if (!blogSidebarMetricsValid && !measureBlogSidebarStickyMetrics()) return;

    const currentSidebarY = Number.parseFloat(blogSidebar.style.getPropertyValue('--blog-sidebar-y')) || 0;
    const desiredY = parentProposalScrollY + getBlogSidebarStickyTop() - blogSidebarBaseTop;
    const maxY = Math.max(0, blogSidebarTrackBottom - blogSidebarBaseTop - blogSidebarHeight);
    const nextY = Math.max(0, Math.min(desiredY, maxY));

    if (Math.abs(nextY - currentSidebarY) >= 0.25) {
      blogSidebar.style.setProperty('--blog-sidebar-y', `${nextY.toFixed(2)}px`);
    }
  }

  function updateProposalActiveFromScroll() {
    if (!isProposalModeActive() || !proposalSlides.length) return;

    updateProposalMenuStickyPosition();

    const viewportCenter = getProposalViewportScrollY() + getProposalViewportHeight() * 0.5;
    let closestIndex = activeProposalSlide;
    let closestDistance = Infinity;

    proposalSlides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = getProposalDocumentTop(slide) + rect.height * 0.5;
      const distance = Math.abs(slideCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeProposalSlide) {
      updateProposalSlide(closestIndex);
    }
  }

  function requestProposalActiveFromScroll() {
    if (!isProposalModeActive() || proposalActiveAnimationFrame) return;
    if (proposalClickScrollAnimating && !isInIframe) return;

    if (isInIframe) {
      const now = performance.now();
      const minInterval = 96;
      const elapsed = now - proposalLastActiveUpdateTime;

      if (elapsed < minInterval) {
        if (!proposalActiveThrottleTimer) {
          proposalActiveThrottleTimer = window.setTimeout(() => {
            proposalActiveThrottleTimer = 0;
            requestProposalActiveFromScroll();
          }, minInterval - elapsed);
        }
        return;
      }
    }

    proposalActiveAnimationFrame = window.requestAnimationFrame(() => {
      proposalActiveAnimationFrame = 0;
      proposalLastActiveUpdateTime = performance.now();
      updateProposalActiveFromScroll();
    });
  }

  function cancelProposalScrollAnimation() {
    if (proposalScrollAnimationFrame) {
      window.cancelAnimationFrame(proposalScrollAnimationFrame);
      proposalScrollAnimationFrame = 0;
    }

    proposalClickScrollAnimating = false;

    if (proposalScrollAnimationWindow) {
      setProposalInstantScrollMode(proposalScrollAnimationWindow, false);
      proposalScrollAnimationWindow = null;
    }
  }

  function easeProposalScroll(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function getProposalClickScrollDuration(distance) {
    return Math.max(550, Math.min(1450, 420 + Math.abs(distance) * 0.14));
  }

  function getProposalWindowScrollY(scrollWindow) {
    try {
      return scrollWindow.scrollY || scrollWindow.pageYOffset || 0;
    } catch (e) {
      return window.scrollY || 0;
    }
  }

  function getProposalWindowMaxScrollY(scrollWindow) {
    try {
      const doc = scrollWindow.document.documentElement;
      const body = scrollWindow.document.body;
      const scrollHeight = Math.max(
        doc ? doc.scrollHeight : 0,
        body ? body.scrollHeight : 0
      );
      return Math.max(0, scrollHeight - scrollWindow.innerHeight);
    } catch (e) {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
  }

  function setProposalWindowScrollY(scrollWindow, scrollY) {
    try {
      const doc = scrollWindow.document;
      const scrollTarget = doc.scrollingElement || doc.documentElement || doc.body;
      if (scrollTarget) {
        scrollTarget.scrollTop = scrollY;
        return;
      }
    } catch (e) {
      // Fall through to scrollTo for cross-window edge cases.
    }

    try {
      scrollWindow.scrollTo(0, scrollY);
    } catch (innerError) {
      try {
        window.scrollTo(0, scrollY);
      } catch (finalError) { }
    }
  }

  function setProposalElementInstantScroll(element, isActive) {
    if (!element) return;

    if (isActive) {
      if (proposalInstantScrollStyles && !proposalInstantScrollStyles.has(element)) {
        proposalInstantScrollStyles.set(element, {
          value: element.style.getPropertyValue('scroll-behavior'),
          priority: element.style.getPropertyPriority('scroll-behavior')
        });
      }
      element.style.setProperty('scroll-behavior', 'auto', 'important');
      return;
    }

    const previous = proposalInstantScrollStyles ? proposalInstantScrollStyles.get(element) : null;
    if (previous) {
      if (previous.value) {
        element.style.setProperty('scroll-behavior', previous.value, previous.priority || '');
      } else {
        element.style.removeProperty('scroll-behavior');
      }
      proposalInstantScrollStyles.delete(element);
    } else {
      element.style.removeProperty('scroll-behavior');
    }
  }

  function setProposalInstantScrollMode(scrollWindow, isActive) {
    try {
      const doc = scrollWindow.document;
      setProposalElementInstantScroll(doc.documentElement, isActive);
      setProposalElementInstantScroll(doc.body, isActive);
    } catch (e) {
      if (scrollWindow === window) {
        setProposalElementInstantScroll(document.documentElement, isActive);
        setProposalElementInstantScroll(document.body, isActive);
      }
    }
  }

  function animateProposalClickScroll(scrollWindow, targetY) {
    const maxScrollY = getProposalWindowMaxScrollY(scrollWindow);
    const safeTargetY = Math.max(0, Math.min(targetY, maxScrollY));
    const startY = getProposalWindowScrollY(scrollWindow);
    const distance = safeTargetY - startY;

    cancelProposalScrollAnimation();

    if (Math.abs(distance) < 2) {
      setProposalInstantScrollMode(scrollWindow, true);
      setProposalWindowScrollY(scrollWindow, safeTargetY);
      setProposalInstantScrollMode(scrollWindow, false);
      requestProposalActiveFromScroll();
      return;
    }

    const duration = getProposalClickScrollDuration(distance);
    let startTime = 0;
    proposalClickScrollAnimating = true;
    proposalScrollAnimationWindow = scrollWindow;
    setProposalInstantScrollMode(scrollWindow, true);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min(1, (timestamp - startTime) / duration);
      const nextY = startY + distance * easeProposalScroll(progress);

      setProposalWindowScrollY(scrollWindow, nextY);

      if (progress < 1) {
        proposalScrollAnimationFrame = window.requestAnimationFrame(step);
      } else {
        proposalScrollAnimationFrame = 0;
        proposalClickScrollAnimating = false;
        setProposalInstantScrollMode(scrollWindow, false);
        proposalScrollAnimationWindow = null;
        requestProposalActiveFromScroll();
      }
    }

    proposalScrollAnimationFrame = window.requestAnimationFrame(step);
  }

  function scrollToProposalSlide(slide) {
    if (!slide) return;

    const offset = window.matchMedia('(max-width: 768px)').matches
      ? 18
      : window.matchMedia('(max-width: 1024px)').matches
        ? 24
        : 28;

    animateProposalClickScroll(window, Math.max(0, getProposalDocumentTop(slide) - offset));
  }

  function canMoveProposalSlide(direction) {
    if (!proposalSlides.length) return false;
    const nextIndex = activeProposalSlide + direction;
    return nextIndex >= 0 && nextIndex < proposalSlides.length;
  }

  function moveProposalSlide(direction) {
    if (proposalSlideLocked || !canMoveProposalSlide(direction)) return false;

    const nextIndex = activeProposalSlide + direction;
    proposalSlideLocked = true;
    updateProposalSlide(nextIndex);
    window.setTimeout(() => {
      proposalSlideLocked = false;
    }, proposalSlideLockMs);
    return true;
  }

  function notifyLayoutChange() {
    if (!isInIframe) return;
    sendNessoLmsHeight();
  }

  function isBlogHash() {
    return /^#blog(?:\/|$)/.test(window.location.hash || '');
  }

  function isContactHash() {
    return window.location.hash === '#contact';
  }

  function isLuckyHash() {
    return window.location.hash === '#lucky-wheel';
  }

  function isLmsFeaturesHash() {
    return window.location.hash === '#lms-features';
  }

  function isLmsFeatureDetailsHash() {
    return window.location.hash === '#lms-feature-details';
  }

  function getBlogSlugFromHash() {
    const hash = window.location.hash || '';
    if (!/^#blog(?:\/|$)/.test(hash)) return '';

    try {
      return decodeURIComponent(hash.replace(/^#blog\/?/, '').split('?')[0].replace(/^\/+|\/+$/g, ''));
    } catch (e) {
      return hash.replace(/^#blog\/?/, '').split('?')[0].replace(/^\/+|\/+$/g, '');
    }
  }

  function stripBlogHtml(html) {
    const node = document.createElement('div');
    node.innerHTML = html || '';
    return (node.textContent || node.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeBlogSearchText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getBlogPostSearchText(post) {
    return normalizeBlogSearchText([
      getBlogPostTitle(post),
      getBlogPostExcerpt(post),
      getBlogPostCategoryText(post),
      post && post.slug ? post.slug : '',
      stripBlogHtml(getBlogPostContentHtml(post))
    ].join(' '));
  }

  function escapeBlogAttr(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function escapeBlogHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatBlogDate(dateString) {
    if (!dateString) return '';

    try {
      return new Intl.DateTimeFormat(getCurrentNessoLanguage() === 'en' ? 'en-US' : 'vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch (e) {
      return '';
    }
  }

  function getBlogLocale() {
    return getCurrentNessoLanguage() === 'en' ? 'en' : 'vi';
  }

  function getBlogUiText(viText, enText) {
    return getBlogLocale() === 'en' ? enText : viText;
  }

  function getBlogTranslationValue(translation, key) {
    if (!translation || !translation[key]) return '';
    const value = translation[key];
    if (typeof value === 'string') return value;
    return value.rendered || value.raw || '';
  }

  function hasBlogTranslationContent(translation) {
    return Boolean(
      stripBlogHtml(getBlogTranslationValue(translation, 'title'))
      || stripBlogHtml(getBlogTranslationValue(translation, 'excerpt'))
      || stripBlogHtml(getBlogTranslationValue(translation, 'content'))
    );
  }

  function getBlogPostTranslation(post, locale = getBlogLocale()) {
    const translations = post && post.nesso_translations ? post.nesso_translations : null;
    if (!translations || typeof translations !== 'object') return null;

    const preferred = translations[locale];
    if (hasBlogTranslationContent(preferred)) return preferred;

    const fallback = translations.vi;
    return hasBlogTranslationContent(fallback) ? fallback : null;
  }

  function getBlogPostContentHtml(post) {
    const translation = getBlogPostTranslation(post);
    const localizedContent = getBlogTranslationValue(translation, 'content');
    if (localizedContent) return localizedContent;
    return post && post.content && post.content.rendered ? post.content.rendered : '';
  }

  function getBlogPostTitle(post) {
    const translation = getBlogPostTranslation(post);
    const localizedTitle = getBlogTranslationValue(translation, 'title');
    const source = localizedTitle || (post && post.title ? post.title.rendered : '');
    return stripBlogHtml(source) || getBlogUiText('Bài viết LMS', 'LMS Article');
  }

  function getBlogPostExcerpt(post) {
    const translation = getBlogPostTranslation(post);
    const localizedExcerpt = getBlogTranslationValue(translation, 'excerpt');
    const source = localizedExcerpt
      || (post && post.excerpt && post.excerpt.rendered ? post.excerpt.rendered : '')
      || getBlogPostContentHtml(post);
    const text = stripBlogHtml(source);
    return text.length > 154 ? `${text.slice(0, 154).trim()}...` : text;
  }

  function getBlogMediaSource(media) {
    if (!media) return '';

    const sizes = media.media_details && media.media_details.sizes ? media.media_details.sizes : null;
    return (sizes && sizes.large && sizes.large.source_url)
      || (sizes && sizes.medium_large && sizes.medium_large.source_url)
      || (sizes && sizes.full && sizes.full.source_url)
      || media.source_url
      || '';
  }

  function getBlogPostImage(post) {
    if (post && post._nessoFeaturedImage) {
      return post._nessoFeaturedImage;
    }

    const media = post
      && post._embedded
      && post._embedded['wp:featuredmedia']
      && post._embedded['wp:featuredmedia'][0];

    return getBlogMediaSource(media);
  }

  async function hydrateBlogFeaturedImages(posts) {
    if (!Array.isArray(posts) || !posts.length) return posts;

    const mediaIds = Array.from(new Set(posts
      .filter(post => post && !getBlogPostImage(post) && Number(post.featured_media))
      .map(post => Number(post.featured_media))));

    if (!mediaIds.length) return posts;

    const mediaResults = await Promise.all(mediaIds.map(async mediaId => {
      try {
        const response = await fetch(`${lmsBlogConfig.apiBase}/media/${mediaId}?_fields=id,source_url,media_details&_=${lmsBlogState.cacheBust}`, {
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) return null;

        const media = await response.json();
        return {
          id: Number(media && media.id ? media.id : mediaId),
          url: getBlogMediaSource(media)
        };
      } catch (e) {
        return null;
      }
    }));

    const mediaMap = new Map();
    mediaResults.forEach(item => {
      if (item && item.id && item.url) {
        mediaMap.set(item.id, item.url);
      }
    });

    posts.forEach(post => {
      const mediaId = Number(post && post.featured_media);
      const imageUrl = mediaMap.get(mediaId);
      if (imageUrl) {
        post._nessoFeaturedImage = imageUrl;
      }
    });

    return posts;
  }

  function getBlogPostTermIds(post) {
    const ids = new Set();
    ['lms_category', 'lms_categories', 'lms-categories', 'categories'].forEach(key => {
      if (post && Array.isArray(post[key])) {
        post[key].forEach(id => ids.add(String(id)));
      }
    });

    const embeddedTerms = post
      && post._embedded
      && Array.isArray(post._embedded['wp:term'])
      ? post._embedded['wp:term']
      : [];

    embeddedTerms.flat().forEach(term => {
      if (term && term.id) ids.add(String(term.id));
    });

    return Array.from(ids);
  }

  function getBlogCategoryName(category) {
    if (!category) return '';
    const englishName = category.nesso_name_en || (category.meta && category.meta._nesso_lms_name_en);
    if (getBlogLocale() === 'en' && stripBlogHtml(englishName)) {
      return stripBlogHtml(englishName);
    }
    return stripBlogHtml(category.name);
  }

  function getBlogPostCategoryText(post) {
    const embeddedTerms = post
      && post._embedded
      && Array.isArray(post._embedded['wp:term'])
      ? post._embedded['wp:term'].flat()
      : [];
    const lmsTerms = embeddedTerms.filter(term => {
      const taxonomy = String(term && term.taxonomy ? term.taxonomy : '').toLowerCase();
      return taxonomy.includes('lms') || taxonomy.includes('category');
    });
    const termNames = lmsTerms.map(getBlogCategoryName).filter(Boolean);

    if (termNames.length) return termNames.slice(0, 2).join(', ');

    const firstTermId = getBlogPostTermIds(post)[0];
    const category = lmsBlogState.categories.find(item => String(item.id) === String(firstTermId));
    return category ? getBlogCategoryName(category) : 'LMS';
  }

  function deriveBlogCategoriesFromPosts(posts) {
    const map = new Map();

    posts.forEach(post => {
      const embeddedTerms = post
        && post._embedded
        && Array.isArray(post._embedded['wp:term'])
        ? post._embedded['wp:term'].flat()
        : [];

      embeddedTerms.forEach(term => {
        if (!term || !term.id || !term.name) return;
        const taxonomy = String(term.taxonomy || '').toLowerCase();
        if (!taxonomy.includes('lms') && !taxonomy.includes('category')) return;
        map.set(String(term.id), {
          id: term.id,
          name: term.name,
          slug: term.slug || String(term.id),
          nesso_name_en: term.nesso_name_en || (term.meta && term.meta._nesso_lms_name_en) || ''
        });
      });
    });

    return Array.from(map.values());
  }

  async function fetchFirstBlogEndpoint(endpoints, query) {
    for (const endpoint of endpoints) {
      try {
        const separator = query ? '&' : '';
        const response = await fetch(`${lmsBlogConfig.apiBase}/${endpoint}?${query}${separator}_=${lmsBlogState.cacheBust}`, {
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) continue;

        const data = await response.json();
        if (Array.isArray(data)) return data;
      } catch (e) {}
    }

    return [];
  }

  function setBlogStatus(message) {
    if (!blogStatus) return;

    blogStatus.hidden = !message;
    blogStatus.classList.remove('blog-view__status--empty');
    blogStatus.textContent = message || '';
  }

  function setBlogEmptyStatus(messageType = 'empty') {
    if (!blogStatus) return;

    const isCategoryEmpty = messageType === 'category';
    const isSearchEmpty = messageType === 'search';
    const title = isSearchEmpty
      ? getBlogUiText('Chưa tìm thấy bài viết phù hợp', 'No matching articles found')
      : (isCategoryEmpty
        ? getBlogUiText('Danh mục này chưa có bài viết', 'This category has no articles yet')
        : getBlogUiText('Bài viết đang được cập nhật', 'Articles are being updated'));
    const description = isSearchEmpty
      ? getBlogUiText('Bạn có thể thử từ khóa khác hoặc chọn một danh mục rộng hơn.', 'Try another keyword or choose a broader category.')
      : (isCategoryEmpty
        ? getBlogUiText('Nesso sẽ sớm bổ sung thêm nội dung cho chủ đề này. Hãy xem các danh mục khác trong lúc chờ bài viết mới.', 'Nesso will add more content for this topic soon. You can explore other categories while waiting.')
        : getBlogUiText('Nesso đang chuẩn bị các chia sẻ mới về LMS, thiết kế học tập và chuyển đổi đào tạo cho doanh nghiệp.', 'Nesso is preparing new insights on LMS, learning design, and enterprise training transformation.'));
    blogStatus.hidden = false;
    blogStatus.classList.add('blog-view__status--empty');
    blogStatus.innerHTML = `
      <div class="blog-view__status-card">
        <span class="blog-view__eyebrow">${getBlogUiText('Bài viết của Nesso', 'Nesso Articles')}</span>
        <strong>${escapeBlogHtml(title)}</strong>
        <span>${escapeBlogHtml(description)}</span>
      </div>
    `;
  }

  function renderBlogFeatured() {
    if (!blogFeatured) return;

    const featuredPosts = lmsBlogState.posts.slice(0, 3);
    const featuredCount = featuredPosts.length;
    if (featuredCount) {
      lmsBlogState.featuredIndex = Math.max(0, Math.min(lmsBlogState.featuredIndex, featuredCount - 1));
    } else {
      lmsBlogState.featuredIndex = 0;
    }
    const featuredPost = featuredPosts[lmsBlogState.featuredIndex];
    blogFeatured.hidden = false;

    if (!featuredPost) {
      blogFeatured.innerHTML = `
        <div class="blog-view__featured-empty">
          <div class="blog-view__featured-media">
            <img src="https://nesso.vn/wp-content/uploads/2026/06/hero-dashboard-mockup.png" alt="Dashboard LMS NESSO" loading="lazy" decoding="async">
          </div>
          <div class="blog-view__featured-body">
            <span class="blog-view__eyebrow">${getBlogUiText('Bài viết nổi bật', 'Featured Article')}</span>
            <strong>${getBlogUiText('Từ nội dung tĩnh đến trải nghiệm học tập tương tác', 'From static content to interactive learning experiences')}</strong>
            <span>${getBlogUiText('NESSO đang chuẩn bị các bài viết chuyên sâu về LMS, thiết kế học tập và dữ liệu đào tạo.', 'NESSO is preparing in-depth articles on LMS, learning design, and training data.')}</span>
            <div class="blog-view__featured-actions"><span class="blog-view__featured-progress-line blog-view__featured-progress-line--active" aria-hidden="true"></span><i class="blog-view__featured-arrow-slot blog-view__featured-arrow-slot--prev"><img class="blog-view__featured-arrow" src="https://nesso.vn/wp-content/uploads/2026/06/arrow.png" alt=""></i><i class="blog-view__featured-arrow-slot"><img class="blog-view__featured-arrow" src="https://nesso.vn/wp-content/uploads/2026/06/arrow.png" alt=""></i></div>
          </div>
        </div>
      `;
      return;
    }

    const imageUrl = getBlogPostImage(featuredPost);
    blogFeatured.innerHTML = '';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'blog-view__featured-button';
    button.addEventListener('click', () => openBlogPost(featuredPost.slug || String(featuredPost.id || '')));

    const media = document.createElement('div');
    media.className = 'blog-view__featured-media';
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = getBlogPostTitle(featuredPost);
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);
    }

    const body = document.createElement('div');
    body.className = 'blog-view__featured-body';

    const meta = document.createElement('div');
    meta.className = 'blog-view__article-meta';
    meta.textContent = [getBlogPostCategoryText(featuredPost), formatBlogDate(featuredPost.date)].filter(Boolean).join(' / ');

    const title = document.createElement('h2');
    title.className = 'blog-view__featured-title';
    title.textContent = getBlogPostTitle(featuredPost);

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-view__featured-text';
    excerpt.textContent = getBlogPostExcerpt(featuredPost);

    const actions = document.createElement('div');
    actions.className = 'blog-view__featured-actions';
    const lineCount = Math.max(1, featuredCount || 1);
    actions.innerHTML = `${Array.from({ length: lineCount }, (_, index) => `<span class="blog-view__featured-progress-line${index === lmsBlogState.featuredIndex ? ' blog-view__featured-progress-line--active' : ''}" aria-hidden="true"></span>`).join('')}<i class="blog-view__featured-arrow-slot blog-view__featured-arrow-slot--prev" aria-label="${escapeBlogAttr(getBlogUiText('Bài nổi bật trước', 'Previous featured article'))}"><img class="blog-view__featured-arrow" src="https://nesso.vn/wp-content/uploads/2026/06/arrow.png" alt=""></i><i class="blog-view__featured-arrow-slot blog-view__featured-arrow-slot--next" aria-label="${escapeBlogAttr(getBlogUiText('Bài nổi bật tiếp theo', 'Next featured article'))}"><img class="blog-view__featured-arrow" src="https://nesso.vn/wp-content/uploads/2026/06/arrow.png" alt=""></i>`;

    body.append(meta, title, excerpt, actions);
    button.append(media, body);
    blogFeatured.appendChild(button);

    const prevArrow = actions.querySelector('.blog-view__featured-arrow-slot--prev');
    const nextArrow = actions.querySelector('.blog-view__featured-arrow-slot--next');
    if (prevArrow) {
      prevArrow.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (!featuredCount) return;
        lmsBlogState.featuredIndex = (lmsBlogState.featuredIndex - 1 + featuredCount) % featuredCount;
        renderBlogFeatured();
        notifyLayoutChange();
      });
    }
    if (nextArrow) {
      nextArrow.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (!featuredCount) return;
        lmsBlogState.featuredIndex = (lmsBlogState.featuredIndex + 1) % featuredCount;
        renderBlogFeatured();
        notifyLayoutChange();
      });
    }
  }

  function getActiveBlogPost() {
    if (!lmsBlogState.activeSlug) return null;

    return lmsBlogState.posts.find(item => {
      return String(item.slug || '') === String(lmsBlogState.activeSlug)
        || String(item.id || '') === String(lmsBlogState.activeSlug);
    }) || null;
  }

  function getBlogSidebarActiveCategory() {
    const activePost = getActiveBlogPost();
    if (!activePost) return lmsBlogState.activeCategory;

    const postTermIds = getBlogPostTermIds(activePost);
    const categoryIds = new Set(lmsBlogState.categories.map(category => String(category.id)));
    return postTermIds.find(termId => categoryIds.has(String(termId))) || postTermIds[0] || lmsBlogState.activeCategory;
  }

  function renderBlogCategories() {
    const sidebarActiveCategory = String(getBlogSidebarActiveCategory());
    const categoryButtons = Array.from(document.querySelectorAll('[data-blog-category]'));
    categoryButtons.forEach(button => {
      const isActive = String(button.dataset.blogCategory) === sidebarActiveCategory;
      button.classList.toggle('blog-view__category--active', isActive);
    });

    if (!blogCategoriesRoot) return;
    blogCategoriesRoot.textContent = '';

    lmsBlogState.categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'blog-view__category';
      button.dataset.blogCategory = String(category.id);
      button.textContent = getBlogCategoryName(category);
      button.classList.toggle('blog-view__category--active', sidebarActiveCategory === String(category.id));
      button.addEventListener('click', () => {
        lmsBlogState.activeCategory = String(category.id);
        lmsBlogState.activeSlug = '';
        syncBlogRoute('');
        renderLmsBlog();
      });
      blogCategoriesRoot.appendChild(button);
    });
  }

  function getFilteredBlogPosts() {
    let posts = lmsBlogState.posts;

    const query = normalizeBlogSearchText(lmsBlogState.searchTerm);

    if (!query && lmsBlogState.activeCategory !== 'all') {
      posts = posts.filter(post => {
        return getBlogPostTermIds(post).includes(String(lmsBlogState.activeCategory));
      });
    }

    if (!query) return posts;

    return posts.filter(post => {
      return getBlogPostSearchText(post).includes(query);
    });
  }

  function openBlogPost(slug) {
    if (!slug) return;

    lmsBlogState.activeSlug = String(slug);
    syncBlogRoute(lmsBlogState.activeSlug, true);
    renderLmsBlog();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  function getBlogNodeHtml(node) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(node.cloneNode(true));
    return wrapper.innerHTML;
  }

  function isBlogMediaNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;

    if (node.matches('figure, picture, iframe, video, img, .wp-caption, .wp-block-image')) {
      return true;
    }

    if (node.matches('p')) {
      const text = (node.textContent || '').replace(/\s+/g, '').trim();
      const hasMedia = Boolean(node.querySelector('img, picture, iframe, video'));
      return hasMedia && !text;
    }

    return false;
  }

  function hasVisibleBlogNodes(nodes) {
    return nodes.some(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return Boolean((node.textContent || '').trim());
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return false;
      if (isBlogMediaNode(node) || node.matches('table, ul, ol, blockquote')) return true;
      return Boolean((node.textContent || '').trim());
    });
  }

  function buildBlogArticleContent(contentHtml) {
    const source = document.createElement('div');
    source.innerHTML = contentHtml || '';

    const blocks = [];
    let currentTitle = '';
    let currentNodes = [];

    function flushSection(defaultTitle) {
      if (!hasVisibleBlogNodes(currentNodes)) {
        currentTitle = '';
        currentNodes = [];
        return;
      }

      const title = currentTitle || defaultTitle || getBlogUiText('Tổng quan', 'Overview');
      const bodyHtml = currentNodes.map(getBlogNodeHtml).join('').trim();
      blocks.push(`
        <section class="blog-view__article-section">
          <div class="blog-view__article-section-head">
            <h2>${escapeBlogHtml(title)}</h2>
          </div>
          <div class="blog-view__article-section-content">${bodyHtml || `<p>${getBlogUiText('Nội dung đang được cập nhật.', 'Content is being updated.')}</p>`}</div>
        </section>
      `);
      currentTitle = '';
      currentNodes = [];
    }

    function addMediaBlock(node) {
      const mediaHtml = getBlogNodeHtml(node);
      if (!mediaHtml.trim()) return;

      blocks.push(`
        <div class="blog-view__article-media">${mediaHtml}</div>
      `);
    }

    Array.from(source.childNodes).forEach(node => {
      const isSectionHeading = node.nodeType === Node.ELEMENT_NODE
        && /^(H2|H3|H4)$/i.test(node.tagName || '');

      if (isSectionHeading) {
        flushSection(blocks.length ? getBlogUiText('Nội dung', 'Content') : getBlogUiText('Tổng quan', 'Overview'));
        currentTitle = stripBlogHtml(node.innerHTML) || getBlogUiText('Nội dung', 'Content');
        return;
      }

      if (isBlogMediaNode(node)) {
        if (hasVisibleBlogNodes(currentNodes)) {
          flushSection(blocks.length ? getBlogUiText('Nội dung', 'Content') : getBlogUiText('Tổng quan', 'Overview'));
        }
        addMediaBlock(node);
        return;
      }

      currentNodes.push(node);
    });

    flushSection(blocks.length ? getBlogUiText('Nội dung', 'Content') : getBlogUiText('Tổng quan', 'Overview'));

    if (!blocks.length) {
      return `
        <section class="blog-view__article-section">
          <div class="blog-view__article-section-head">
            <h2>${getBlogUiText('Tổng quan', 'Overview')}</h2>
          </div>
          <div class="blog-view__article-section-content"><p>${getBlogUiText('Nội dung đang được cập nhật.', 'Content is being updated.')}</p></div>
        </section>
      `;
    }

    return blocks.join('');
  }

  function createBlogCard(post) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'blog-view__card';
    card.addEventListener('click', () => openBlogPost(post.slug || String(post.id || '')));

    const media = document.createElement('div');
    media.className = 'blog-view__card-media';
    const imageUrl = getBlogPostImage(post);
    if (imageUrl) {
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = getBlogPostTitle(post);
      image.loading = 'lazy';
      image.decoding = 'async';
      media.appendChild(image);
    }

    const body = document.createElement('div');
    body.className = 'blog-view__card-body';

    const meta = document.createElement('div');
    meta.className = 'blog-view__card-meta';
    meta.textContent = [getBlogPostCategoryText(post), formatBlogDate(post.date)].filter(Boolean).join(' / ');

    const title = document.createElement('h2');
    title.className = 'blog-view__card-title';
    title.textContent = getBlogPostTitle(post);

    const excerpt = document.createElement('p');
    excerpt.className = 'blog-view__card-excerpt';
    excerpt.textContent = getBlogPostExcerpt(post);

    body.append(meta, title, excerpt);
    card.append(media, body);
    return card;
  }

  function renderBlogList() {
    if (!blogGrid || !blogArticle) return;

    blogView.classList.remove('blog-view--article-mode');
    document.documentElement.classList.remove('blog-article-boot');
    const posts = getFilteredBlogPosts();
    blogArticle.hidden = true;
    blogArticle.textContent = '';
    blogGrid.hidden = false;
    blogGrid.textContent = '';

    if (!posts.length) {
      setBlogEmptyStatus(lmsBlogState.searchTerm ? 'search' : (lmsBlogState.posts.length ? 'category' : 'empty'));
      blogGrid.hidden = true;
      notifyLayoutChange();
      return;
    }

    setBlogStatus('');
    posts.forEach(post => {
      blogGrid.appendChild(createBlogCard(post));
    });
    resetBlogSidebarStickyMetrics();
    updateBlogSidebarStickyPosition();
    notifyLayoutChange();
  }

  function renderBlogArticle(post) {
    if (!blogArticle || !blogGrid) return;

    blogView.classList.add('blog-view--article-mode');
    document.documentElement.classList.add('blog-article-boot');
    blogGrid.hidden = true;
    blogArticle.hidden = false;
    setBlogStatus('');

    const imageUrl = getBlogPostImage(post);
    const articleContent = buildBlogArticleContent(getBlogPostContentHtml(post));
    blogArticle.innerHTML = `
      <button class="blog-view__back" type="button" data-blog-back>&larr; ${getBlogUiText('Quay lại', 'Back')}</button>
      <div class="blog-view__article-meta">${[getBlogPostCategoryText(post), formatBlogDate(post.date)].filter(Boolean).join(' / ')}</div>
      <h1 class="blog-view__article-title">${escapeBlogHtml(getBlogPostTitle(post))}</h1>
      ${imageUrl ? `<div class="blog-view__article-hero"><img src="${escapeBlogAttr(imageUrl)}" alt="${escapeBlogAttr(getBlogPostTitle(post))}" loading="lazy" decoding="async"></div>` : ''}
      <div class="blog-view__article-body">${articleContent}</div>
    `;

    const backButton = blogArticle.querySelector('[data-blog-back]');
    if (backButton) {
      backButton.addEventListener('click', () => {
        lmsBlogState.activeSlug = '';
        syncBlogRoute('');
        renderLmsBlog();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
    }

    resetBlogSidebarStickyMetrics();
    updateBlogSidebarStickyPosition();
    notifyLayoutChange();
  }

  function renderLmsBlog() {
    if (!blogView) return;

    renderBlogFeatured();
    renderBlogCategories();

    if (lmsBlogState.activeSlug && !lmsBlogState.loaded) {
      setBlogStatus(getBlogUiText('Đang tải bài viết...', 'Loading articles...'));
      if (blogGrid) {
        blogGrid.hidden = true;
        blogGrid.textContent = '';
      }
      if (blogArticle) {
        blogArticle.hidden = true;
        blogArticle.textContent = '';
      }
      notifyLayoutChange();
      return;
    }

    if (lmsBlogState.activeSlug) {
      const post = getActiveBlogPost();

      if (post) {
        renderBlogArticle(post);
        return;
      }
    }

    lmsBlogState.activeSlug = '';
    renderBlogList();
  }

  async function loadLmsBlogData() {
    if (!blogView) {
      return;
    }

    if (lmsBlogState.loaded) {
      renderLmsBlog();
      return;
    }

    if (lmsBlogState.loading) {
      return;
    }

    lmsBlogState.loading = true;
    setBlogStatus(getBlogUiText('Đang tải bài viết...', 'Loading articles...'));

    const [categories, posts] = await Promise.all([
      fetchFirstBlogEndpoint(lmsBlogConfig.categoryEndpoints, 'per_page=100&orderby=name&order=asc'),
      fetchFirstBlogEndpoint(lmsBlogConfig.postEndpoints, 'per_page=100&_embed=1&orderby=date&order=desc')
    ]);

    const hydratedPosts = await hydrateBlogFeaturedImages(posts);

    lmsBlogState.posts = hydratedPosts;
    lmsBlogState.categories = categories.length ? categories : deriveBlogCategoriesFromPosts(hydratedPosts);
    lmsBlogState.loaded = true;
    lmsBlogState.loading = false;
    renderLmsBlog();
  }

  function syncBlogRoute(postSlug, isActive = true, options = {}) {
    const slug = postSlug ? encodeURIComponent(postSlug) : '';

    if (window.history && window.history.replaceState) {
      const nextUrl = isActive
        ? `#blog${slug ? `/${slug}` : ''}`
        : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_BLOG_ROUTE',
        active: isActive,
        postSlug: postSlug || '',
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function syncContactRoute(isActive = true, options = {}) {
    if (window.history && window.history.replaceState) {
      const nextUrl = isActive
        ? '#contact'
        : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_CONTACT_ROUTE',
        active: isActive,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function syncLmsFeaturesRoute(isActive = true, options = {}) {
    if (window.history && window.history.replaceState) {
      const nextUrl = isActive
        ? '#lms-features'
        : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_FEATURES_ROUTE',
        active: isActive,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function syncLmsFeatureDetailsRoute(isActive = true, options = {}) {
    if (window.history && window.history.replaceState) {
      const nextUrl = isActive
        ? '#lms-feature-details'
        : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_FEATURE_DETAILS_ROUTE',
        active: isActive,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function syncLuckyRoute(isActive = true, options = {}) {
    if (window.history && window.history.replaceState) {
      const nextUrl = isActive ? '#lucky-wheel' : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }
    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_LUCKY_ROUTE',
        active: isActive,
        routeCode: NESSO_LUCKY_WHEEL_ROUTE_CODE,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function normalizeImageRouteCode(routeCode) {
    const code = String(routeCode || '').replace(/^#\/?/, '').replace(/^\/+|\/+$/g, '');
    return Object.prototype.hasOwnProperty.call(NESSO_IMAGE_ONLY_ROUTES, code) ? code : '';
  }

  function getImageRouteCodeFromHash() {
    try {
      return normalizeImageRouteCode(decodeURIComponent(window.location.hash || ''));
    } catch (e) {
      return normalizeImageRouteCode(window.location.hash || '');
    }
  }

  function isImageRouteHash() {
    return !!getImageRouteCodeFromHash();
  }

  function updateImageRouteView(routeCode) {
    const config = NESSO_IMAGE_ONLY_ROUTES[routeCode];
    if (!config || !imageRouteImg) return;

    if (imageRouteMobileSource) {
      imageRouteMobileSource.setAttribute('srcset', config.mobile);
    }
    imageRouteImg.src = config.desktop;
    imageRouteImg.alt = config.label || 'NESSO';
  }

  function syncImageRoute(routeCode = '', isActive = true, options = {}) {
    const normalizedCode = normalizeImageRouteCode(routeCode);

    if (window.history && window.history.replaceState) {
      const nextUrl = isActive && normalizedCode
        ? `#${normalizedCode}`
        : `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, '', nextUrl);
    }

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_IMAGE_ROUTE',
        active: isActive && !!normalizedCode,
        routeCode: normalizedCode,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function setImageRouteMode(isActive, routeCode = '', options = {}) {
    if (!imageRouteView) return;
    const normalizedCode = normalizeImageRouteCode(routeCode) || getImageRouteCodeFromHash() || NESSO_IMAGE_ONLY_ROUTE_CODES[0];

    if (isActive && document.body.classList.contains('proposal-mode')) setProposalMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('blog-mode')) setBlogMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('contact-mode')) setContactMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-features-mode')) setLmsFeaturesMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) setLmsFeatureDetailsMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lucky-mode')) setLuckyMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('demo-embed-mode')) closeDemoEmbed(false);

    document.body.classList.toggle('image-route-mode', isActive);
    document.documentElement.classList.toggle('image-route-boot', isActive);
    imageRouteView.hidden = !isActive;
    imageRouteView.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    if (isActive) {
      updateImageRouteView(normalizedCode);
      if (options.syncRoute !== false) syncImageRoute(normalizedCode, true, { historyAction: options.historyAction });
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else if (options.syncRoute !== false) {
      syncImageRoute('', false, { historyAction: options.historyAction });
    }

    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
  }

  function setLuckyMode(isActive, options = {}) {
    if (!luckyWheelView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });
    if (isActive && document.body.classList.contains('proposal-mode')) setProposalMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('blog-mode')) setBlogMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('contact-mode')) setContactMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-features-mode')) setLmsFeaturesMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) setLmsFeatureDetailsMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('demo-embed-mode')) closeDemoEmbed(false);

    document.body.classList.toggle('lucky-mode', isActive);
    document.documentElement.classList.toggle('lucky-boot', isActive);
    luckyWheelView.hidden = !isActive;
    luckyWheelView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();

    if (proposalFooterToggle && !document.body.classList.contains('proposal-mode') && !document.body.classList.contains('blog-mode') && !document.body.classList.contains('contact-mode')) {
      proposalFooterToggle.textContent = isActive ? 'Trang chủ' : 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', isActive ? '#' : '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', isActive ? 'Quay về trang chủ' : 'Xem Proposal');
    }

    if (isActive) {
      if (options.reset !== false) resetLuckyWheelView();
      if (options.syncRoute !== false) syncLuckyRoute(true, { historyAction: options.historyAction });
      blogParentLastScrollY = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else if (options.syncRoute !== false) {
      syncLuckyRoute(false, { historyAction: options.historyAction });
    }

    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
    window.setTimeout(notifyLayoutChange, 420);
  }

  function setContactMode(isActive, options = {}) {
    if (!contactView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });

    if (isActive && document.body.classList.contains('proposal-mode')) {
      setProposalMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('blog-mode')) {
      setBlogMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('demo-embed-mode')) {
      closeDemoEmbed(false);
    }

    if (isActive && document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lms-features-mode')) {
      setLmsFeaturesMode(false, { syncRoute: false });
    }
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) {
      setLmsFeatureDetailsMode(false, { syncRoute: false });
    }

    document.body.classList.toggle('contact-mode', isActive);
    document.documentElement.classList.toggle('contact-boot', isActive);
    contactView.hidden = !isActive;
    contactView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();

    if (proposalFooterToggle && !document.body.classList.contains('proposal-mode') && !document.body.classList.contains('blog-mode')) {
      proposalFooterToggle.textContent = 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', 'Xem Proposal');
    }

    if (isActive) {
      if (options.syncRoute !== false) syncContactRoute(true, { historyAction: options.historyAction });
      blogParentLastScrollY = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } else if (options.syncRoute !== false) {
      syncContactRoute(false, { historyAction: options.historyAction });
    }

    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
    window.setTimeout(notifyLayoutChange, 420);
  }

  function stopLmsFeaturesReveals() {
    if (lmsFeaturesRevealObserver) {
      lmsFeaturesRevealObserver.disconnect();
      lmsFeaturesRevealObserver = null;
    }
    if (lmsFeaturesRevealFrame) {
      window.cancelAnimationFrame(lmsFeaturesRevealFrame);
      lmsFeaturesRevealFrame = 0;
    }
  }

  function startLmsFeaturesReveals() {
    if (!lmsFeaturesRevealTargets.length) return;

    stopLmsFeaturesReveals();
    let heroDelayIndex = 0;
    let cardDelayIndex = 0;
    lmsFeaturesRevealTargets.forEach(target => {
      target.classList.remove('lms-features-reveal--visible', 'lms-features-reveal--delay');
      target.classList.add('lms-features-reveal');

      let delay = 0;
      if (target.closest('.lms-features-hero')) {
        delay = heroDelayIndex * 75;
        heroDelayIndex += 1;
      } else if (target.classList.contains('lms-features-grid-card')) {
        delay = (cardDelayIndex % 3) * 90;
        cardDelayIndex += 1;
      }
      target.style.setProperty('--lms-features-reveal-delay', `${delay}ms`);
    });

    if (!('IntersectionObserver' in window)) {
      lmsFeaturesRevealTargets.forEach(target => target.classList.add('lms-features-reveal--visible'));
      return;
    }

    lmsFeaturesRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('lms-features-reveal--visible');
        lmsFeaturesRevealObserver.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    lmsFeaturesRevealFrame = window.requestAnimationFrame(() => {
      lmsFeaturesRevealFrame = 0;
      lmsFeaturesRevealTargets.forEach(target => lmsFeaturesRevealObserver.observe(target));
    });
  }

  function setLmsFeaturesMode(isActive, options = {}) {
    if (!lmsFeaturesView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) setLmsFeatureDetailsMode(false, { syncRoute: false });

    if (isActive && document.body.classList.contains('proposal-mode')) {
      setProposalMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('blog-mode')) {
      setBlogMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('contact-mode')) {
      setContactMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('demo-embed-mode')) {
      closeDemoEmbed(false);
    }

    document.body.classList.toggle('lms-features-mode', isActive);
    document.documentElement.classList.toggle('lms-features-boot', isActive);
    lmsFeaturesView.hidden = !isActive;
    lmsFeaturesView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();

    if (proposalFooterToggle && !document.body.classList.contains('proposal-mode') && !document.body.classList.contains('blog-mode') && !document.body.classList.contains('contact-mode')) {
      proposalFooterToggle.textContent = isActive ? 'Trang chủ' : 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', isActive ? '#' : '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', isActive ? 'Quay về trang chủ' : 'Xem Proposal');
    }

    if (isActive) {
      if (options.syncRoute !== false) syncLmsFeaturesRoute(true, { historyAction: options.historyAction });
      blogParentLastScrollY = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      startLmsFeaturesReveals();
    } else if (options.syncRoute !== false) {
      stopLmsFeaturesReveals();
      syncLmsFeaturesRoute(false, { historyAction: options.historyAction });
    } else {
      stopLmsFeaturesReveals();
    }

    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
    window.setTimeout(notifyLayoutChange, 420);
  }

  function stopLmsFeatureDetailsReveals() {
    if (lmsFeatureDetailsRevealObserver) {
      lmsFeatureDetailsRevealObserver.disconnect();
      lmsFeatureDetailsRevealObserver = null;
    }
    if (lmsFeatureDetailsRevealFrame) {
      window.cancelAnimationFrame(lmsFeatureDetailsRevealFrame);
      lmsFeatureDetailsRevealFrame = 0;
    }
  }

  function startLmsFeatureDetailsReveals() {
    if (!lmsFeatureDetailsRevealTargets.length) return;

    stopLmsFeatureDetailsReveals();
    let sectionIndex = 0;
    lmsFeatureDetailsRevealTargets.forEach(target => {
      target.classList.remove('lms-features-reveal--visible', 'lms-features-reveal--delay');
      target.classList.add('lms-features-reveal');
      const isIntro = target.closest('.lms-feature-details-hero, .lms-feature-details-discovery');
      const delay = isIntro ? sectionIndex++ * 75 : (sectionIndex++ % 2) * 100;
      target.style.setProperty('--lms-features-reveal-delay', `${delay}ms`);
    });

    if (!('IntersectionObserver' in window)) {
      lmsFeatureDetailsRevealTargets.forEach(target => target.classList.add('lms-features-reveal--visible'));
      return;
    }

    lmsFeatureDetailsRevealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('lms-features-reveal--visible');
        lmsFeatureDetailsRevealObserver.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.08
    });

    lmsFeatureDetailsRevealFrame = window.requestAnimationFrame(() => {
      lmsFeatureDetailsRevealFrame = 0;
      lmsFeatureDetailsRevealTargets.forEach(target => lmsFeatureDetailsRevealObserver.observe(target));
    });
  }

  function setLmsFeatureDetailsMode(isActive, options = {}) {
    if (!lmsFeatureDetailsView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });
    if (isActive && document.body.classList.contains('proposal-mode')) setProposalMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('blog-mode')) setBlogMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('contact-mode')) setContactMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lms-features-mode')) setLmsFeaturesMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('lucky-mode')) setLuckyMode(false, { syncRoute: false });
    if (isActive && document.body.classList.contains('demo-embed-mode')) closeDemoEmbed(false);

    document.body.classList.toggle('lms-feature-details-mode', isActive);
    document.documentElement.classList.toggle('lms-feature-details-boot', isActive);
    lmsFeatureDetailsView.hidden = !isActive;
    lmsFeatureDetailsView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();
    lmsFeatureDetailsFilterLastScrollY = 0;
    setLmsFeatureDetailsFilterHeaderHidden(false);

    if (proposalFooterToggle && !document.body.classList.contains('proposal-mode') && !document.body.classList.contains('blog-mode') && !document.body.classList.contains('contact-mode')) {
      proposalFooterToggle.textContent = isActive ? 'Trang chủ' : 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', isActive ? '#' : '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', isActive ? 'Quay về trang chủ' : 'Xem Proposal');
    }

    if (isActive) {
      if (options.syncRoute !== false) syncLmsFeatureDetailsRoute(true, { historyAction: options.historyAction });
      blogParentLastScrollY = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      startLmsFeatureDetailsReveals();
    } else {
      stopLmsFeatureDetailsReveals();
      if (options.syncRoute !== false) syncLmsFeatureDetailsRoute(false, { historyAction: options.historyAction });
    }

    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
    window.setTimeout(notifyLayoutChange, 420);
  }

  function setBlogMode(isActive, options = {}) {
    if (!blogView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });

    if (isActive && document.body.classList.contains('proposal-mode')) {
      setProposalMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('contact-mode')) {
      setContactMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lms-features-mode')) {
      setLmsFeaturesMode(false, { syncRoute: false });
    }
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) {
      setLmsFeatureDetailsMode(false, { syncRoute: false });
    }

    document.body.classList.toggle('blog-mode', isActive);
    document.documentElement.classList.toggle('blog-boot', isActive);
    blogView.hidden = !isActive;
    blogView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();

    if (proposalFooterToggle && !document.body.classList.contains('proposal-mode')) {
      proposalFooterToggle.textContent = isActive ? 'Trang chủ' : 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', isActive ? '#' : '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', isActive ? 'Quay về trang chủ' : 'Xem Proposal');
    }

    if (isActive) {
      const hasExplicitPostSlug = Object.prototype.hasOwnProperty.call(options, 'postSlug');
      lmsBlogState.activeSlug = hasExplicitPostSlug
        ? String(options.postSlug || '')
        : (getBlogSlugFromHash() || lmsBlogState.activeSlug || '');
      if (options.syncRoute !== false) syncBlogRoute(lmsBlogState.activeSlug, true, { historyAction: options.historyAction });
      blogParentLastScrollY = 0;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      loadLmsBlogData();
    } else {
      blogView.classList.remove('blog-view--article-mode');
      document.documentElement.classList.remove('blog-article-boot');
      lmsBlogState.activeSlug = '';
      resetBlogSidebarStickyMetrics();
      if (options.syncRoute !== false) syncBlogRoute('', false, { historyAction: options.historyAction });
    }

    resetBlogSidebarStickyMetrics();
    updateBlogSidebarStickyPosition();
    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 120);
    window.setTimeout(notifyLayoutChange, 420);
  }

  function syncProposalHash(isActive, options = {}) {
    if (!window.history || !window.history.replaceState) return;

    const nextUrl = isActive
      ? '#proposal-view'
      : `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(null, '', nextUrl);

    if (isInIframe) {
      window.parent.postMessage({
        type: 'NESSO_PROPOSAL_ROUTE',
        active: isActive,
        historyAction: options.historyAction || 'push'
      }, '*');
    }
  }

  function setProposalMode(isActive, options = {}) {
    if (!proposalView) return;
    if (isActive && document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });

    if (isActive && document.body.classList.contains('blog-mode')) {
      setBlogMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('contact-mode')) {
      setContactMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false, { syncRoute: false });
    }

    if (isActive && document.body.classList.contains('lms-features-mode')) {
      setLmsFeaturesMode(false, { syncRoute: false });
    }
    if (isActive && document.body.classList.contains('lms-feature-details-mode')) {
      setLmsFeatureDetailsMode(false, { syncRoute: false });
    }

    document.body.classList.toggle('proposal-mode', isActive);
    document.documentElement.classList.toggle('proposal-boot', isActive);
    proposalView.hidden = !isActive;
    proposalView.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    resetStickyHeader();
    if (proposalFooterToggle) {
      proposalFooterToggle.textContent = isActive ? 'Trang chủ' : 'Xem Proposal';
      proposalFooterToggle.setAttribute('href', isActive ? '#' : '#proposal-view');
      proposalFooterToggle.setAttribute('aria-label', isActive ? 'Quay về trang chủ' : 'Xem Proposal');
    }
    if (options.syncRoute !== false) {
      syncProposalHash(isActive, { historyAction: options.historyAction });
    }

    if (isActive) {
      playProposalVideo();
      updateProposalSlide(0);
      lastProposalCenterDistance = null;
      resetProposalMenuStickyMetrics();
      pendingProposalScrollDirection = 0;
      proposalLocking = false;
      document.querySelectorAll('.cta-footer-wrapper .reveal, .footer .reveal').forEach(el => {
        el.classList.add('reveal--visible');
      });
    } else {
      pauseProposalVideo();
      proposalScrollCaptureReady = false;
      pendingProposalScrollDirection = 0;
      proposalLocking = false;
      if (proposalMenu) {
        proposalMenu.style.removeProperty('--proposal-menu-y');
      }
      resetProposalMenuStickyMetrics();
      if (proposalLockAnimationFrame) {
        window.cancelAnimationFrame(proposalLockAnimationFrame);
        proposalLockAnimationFrame = 0;
      }
      if (proposalActiveAnimationFrame) {
        window.cancelAnimationFrame(proposalActiveAnimationFrame);
        proposalActiveAnimationFrame = 0;
      }
      if (proposalActiveThrottleTimer) {
        window.clearTimeout(proposalActiveThrottleTimer);
        proposalActiveThrottleTimer = 0;
      }
      cancelProposalScrollAnimation();
      lastProposalCenterDistance = null;
      notifyProposalScrollState();
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    window.requestAnimationFrame(() => {
      notifyLayoutChange();
      updateProposalActiveFromScroll();
    });
    window.setTimeout(notifyLayoutChange, 80);
    window.setTimeout(notifyLayoutChange, 320);
    window.setTimeout(notifyLayoutChange, 900);
  }

  function setProposalVideoVolume() {
    if (!proposalVideoFrame || !proposalVideoFrame.contentWindow) return;

    try {
      proposalVideoFrame.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: 1 }), 'https://player.vimeo.com');
    } catch (e) {}
  }

  function playProposalVideo() {
    if (!proposalVideoFrame) return;

    const src = proposalVideoFrame.dataset.proposalVideoSrc || proposalVideoFrame.dataset.src || '';
    if (src && proposalVideoFrame.getAttribute('src') !== src) {
      proposalVideoFrame.setAttribute('src', src);
      window.setTimeout(() => {
        setProposalVideoVolume();
        try {
          proposalVideoFrame.contentWindow.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com');
        } catch (e) {}
      }, 900);
      return;
    }

    setProposalVideoVolume();
    try {
      proposalVideoFrame.contentWindow.postMessage(JSON.stringify({ method: 'play' }), 'https://player.vimeo.com');
    } catch (e) {}
  }

  function pauseProposalVideo() {
    if (!proposalVideoFrame) return;

    if (proposalVideoFrame.getAttribute('src')) {
      try {
        proposalVideoFrame.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), 'https://player.vimeo.com');
      } catch (e) {}
      proposalVideoFrame.removeAttribute('src');
    }
  }

  const DEMO_LOCALE_SET_TYPE = 'la-demo-embed:set-locale';
  const DEMO_LOCALE_READY_TYPE = 'la-demo-embed:ready';
  let demoLocaleIframe = null;
  let demoLocaleIframeOrigin = '';
  let demoLocaleLoadHandler = null;

  function getValidatedDemoLocale(locale = getCurrentNessoLanguage()) {
    return NESSO_LANGUAGE_SUPPORTED.has(locale) ? locale : NESSO_LANGUAGE_DEFAULT;
  }

  function getDemoIframeElement() {
    return demoEmbedFrame ? demoEmbedFrame.querySelector('iframe') : null;
  }

  function getDemoIframeOrigin(iframe) {
    if (!iframe || !iframe.src) return '';

    try {
      const origin = new URL(iframe.src, window.location.href).origin;
      return origin && origin !== 'null' ? origin : '';
    } catch (error) {
      return '';
    }
  }

  function postDemoIframeLocale(locale = getCurrentNessoLanguage()) {
    const lang = getValidatedDemoLocale(locale);
    const iframe = getDemoIframeElement();
    if (!iframe || !iframe.contentWindow) return false;

    const targetOrigin = demoLocaleIframeOrigin || getDemoIframeOrigin(iframe);
    if (!targetOrigin || targetOrigin === '*') return false;

    try {
      iframe.contentWindow.postMessage({
        type: DEMO_LOCALE_SET_TYPE,
        version: 1,
        locale: lang
      }, targetOrigin);
      return true;
    } catch (error) {
      return false;
    }
  }

  function detachDemoIframeLocaleSync() {
    if (demoLocaleIframe && demoLocaleLoadHandler) {
      demoLocaleIframe.removeEventListener('load', demoLocaleLoadHandler);
    }

    demoLocaleIframe = null;
    demoLocaleIframeOrigin = '';
    demoLocaleLoadHandler = null;
  }

  function attachDemoIframeLocaleSync(iframe) {
    if (!iframe) return;
    if (demoLocaleIframe === iframe && demoLocaleIframeOrigin) return;

    detachDemoIframeLocaleSync();

    const origin = getDemoIframeOrigin(iframe);
    if (!origin) return;

    demoLocaleIframe = iframe;
    demoLocaleIframeOrigin = origin;
    demoLocaleLoadHandler = () => {
      postDemoIframeLocale(getCurrentNessoLanguage());
    };
    iframe.addEventListener('load', demoLocaleLoadHandler);
  }

  function scheduleDemoIframeLocaleSync(locale = getCurrentNessoLanguage()) {
    postDemoIframeLocale(locale);
    window.setTimeout(() => postDemoIframeLocale(locale), 80);
    window.setTimeout(() => postDemoIframeLocale(getCurrentNessoLanguage()), 260);
  }

  function handleDemoIframeReady(event) {
    const iframe = getDemoIframeElement();
    if (!iframe || !iframe.contentWindow) return;

    const origin = demoLocaleIframeOrigin || getDemoIframeOrigin(iframe);
    if (!origin || event.origin !== origin || event.source !== iframe.contentWindow) return;

    const data = event.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return;
    if (data.type !== DEMO_LOCALE_READY_TYPE || data.version !== 1) return;

    postDemoIframeLocale(getCurrentNessoLanguage());
  }

  function handleDemoLanguageChange(event) {
    const lang = event && event.detail ? event.detail.language : getCurrentNessoLanguage();
    if (!NESSO_LANGUAGE_SUPPORTED.has(lang)) return;
    postDemoIframeLocale(lang);
  }

  window.addEventListener('message', handleDemoIframeReady);
  window.addEventListener('nesso-lms-language-change', handleDemoLanguageChange);
  window.addEventListener('beforeunload', () => {
    window.removeEventListener('message', handleDemoIframeReady);
    window.removeEventListener('nesso-lms-language-change', handleDemoLanguageChange);
    detachDemoIframeLocaleSync();
  }, { once: true });

  function ensureDemoIframeLoaded() {
    if (!demoEmbedFrame) return null;

    let iframe = getDemoIframeElement();
    if (iframe) {
      attachDemoIframeLocaleSync(iframe);
      return iframe;
    }

    if (demoIframeTemplate && demoIframeTemplate.content) {
      const fragment = demoIframeTemplate.content.cloneNode(true);
      iframe = fragment.querySelector('iframe');
      if (iframe) attachDemoIframeLocaleSync(iframe);
      demoEmbedFrame.appendChild(fragment);
      return iframe;
    }

    return null;
  }

  function setDemoTriggersExpanded(isExpanded) {
    demoOpenTriggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  }

  function closeDemoEmbed(shouldUnload) {
    if (!demoEmbedSection) return;

    demoEmbedSection.hidden = true;
    demoEmbedSection.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('demo-embed-mode');
    setNessoLmsParentDemoFrameMode(false);
    setDemoTriggersExpanded(false);
    notifyNessoLmsDemoClosed();

    if (shouldUnload && demoEmbedFrame) {
      detachDemoIframeLocaleSync();
      demoEmbedFrame.textContent = '';
    }

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: demoReturnScrollY, left: 0, behavior: 'auto' });
      notifyLayoutChange();
    });
    window.setTimeout(notifyLayoutChange, 320);
  }

  function openDemoEmbed() {
    if (!demoEmbedSection) return;
    if (document.body.classList.contains('image-route-mode')) setImageRouteMode(false, '', { syncRoute: false });

    if (shouldAutoOpenDemoFromUrl()) {
      clearNessoLmsDemoRoute();
    }

    demoReturnScrollY = window.scrollY;

    if (document.body.classList.contains('proposal-mode')) {
      setProposalMode(false, { syncRoute: false });
    }

    if (document.body.classList.contains('blog-mode')) {
      setBlogMode(false);
    }

    if (document.body.classList.contains('contact-mode')) {
      setContactMode(false);
    }

    if (document.body.classList.contains('lucky-mode')) {
      setLuckyMode(false);
    }

    if (document.body.classList.contains('lms-features-mode')) {
      setLmsFeaturesMode(false);
    }

    ensureDemoIframeLoaded();
    scheduleDemoIframeLocaleSync(getCurrentNessoLanguage());
    demoEmbedSection.hidden = false;
    demoEmbedSection.setAttribute('aria-hidden', 'false');
    document.body.classList.add('demo-embed-mode');
    setNessoLmsParentDemoFrameMode(true);
    setDemoTriggersExpanded(true);

    window.requestAnimationFrame(() => {
      const closeButton = demoEmbedSection.querySelector('[data-demo-close]');
      if (closeButton) closeButton.focus({ preventScroll: true });
      notifyLayoutChange();
    });
    window.setTimeout(notifyLayoutChange, 320);
  }

  function shouldAutoOpenDemoFromUrl() {
    const demoParam = String(nessoLmsUrlParams.get('demo') || nessoLmsUrlParams.get('open') || '').toLowerCase();
    return demoParam === '1'
      || demoParam === 'true'
      || demoParam === 'demo'
      || window.location.hash === '#demo'
      || window.location.hash === '#demo-embed';
  }

  demoOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      openDemoEmbed();
    });
  });

  demoCloseTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeDemoEmbed(true);
    });
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('demo-embed-mode')) {
      event.preventDefault();
      closeDemoEmbed(false);
    }
  });

  if (shouldAutoOpenDemoFromUrl() && window.location.hash !== '#proposal-view' && !isBlogHash() && !isContactHash() && !isLmsFeaturesHash() && !isLuckyHash() && !isImageRouteHash()) {
    window.setTimeout(openDemoEmbed, 220);
    window.setTimeout(() => {
      if (!document.body.classList.contains('demo-embed-mode')) {
        openDemoEmbed();
      }
    }, 900);
  }

  window.addEventListener('message', event => {
    if (!event.data) return;

    if (event.data.type === 'NESSO_PARENT_DEMO_OPEN') {
      openDemoEmbed();
      return;
    }

    if (event.data.type === 'NESSO_PARENT_PROPOSAL_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setProposalMode(true, { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_BLOG_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setBlogMode(true, {
        postSlug: event.data.postSlug || '',
        syncRoute: false
      });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_CONTACT_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setContactMode(true, { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_FEATURES_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setLmsFeaturesMode(true, { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_FEATURE_DETAILS_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setLmsFeatureDetailsMode(true, { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_LUCKY_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setLuckyMode(true, { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_IMAGE_OPEN') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }
      setImageRouteMode(true, event.data.routeCode || '', { syncRoute: false });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_TAP') {
      const clientX = Number(event.data.clientX);
      const clientY = Number(event.data.clientY);
      if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return;

      const tappedElement = document.elementFromPoint(clientX, clientY);
      const clickTarget = tappedElement && tappedElement.closest
        ? tappedElement.closest('a, button, label, input, textarea, select, [role="button"], [tabindex]')
        : null;

      if (clickTarget && clickTarget.click) {
        clickTarget.click();
      }
      return;
    }

    if (event.data.type === 'NESSO_PARENT_HOME') {
      if (document.body.classList.contains('demo-embed-mode')) {
        closeDemoEmbed(false);
      }

      if (document.body.classList.contains('proposal-mode')) {
        setProposalMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('blog-mode')) {
        setBlogMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('contact-mode')) {
        setContactMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('lms-features-mode')) {
        setLmsFeaturesMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('lms-feature-details-mode')) {
        setLmsFeatureDetailsMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('lucky-mode')) {
        setLuckyMode(false, { syncRoute: false });
      } else if (document.body.classList.contains('image-route-mode')) {
        setImageRouteMode(false, '', { syncRoute: false });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        notifyLayoutChange();
      }
    }
  });

  if (headerMenuToggle) {
    headerMenuToggle.addEventListener('click', event => {
      event.preventDefault();
      const shouldOpen = !header.classList.contains('header--nav-open');
      setHeaderNavOpen(shouldOpen);
    });
  }

  homeOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      openLandingHome();
    });
  });

  lmsFeatureTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setLmsFeaturesMode(true);
    });
  });

  lmsFeatureDetailsTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setLmsFeatureDetailsMode(true);
    });
  });

  function setLmsFeatureDetailsFilterHeaderHidden(isHidden) {
    if (!lmsFeatureDetailsFilterBar) return;
    const nextHidden = !!isHidden;
    if (lmsFeatureDetailsFilterHeaderHidden === nextHidden) return;

    lmsFeatureDetailsFilterHeaderHidden = nextHidden;
    lmsFeatureDetailsFilterBar.classList.toggle('lms-feature-details-filters--header-hidden', nextHidden);
  }

  function updateLmsFeatureDetailsFilterStickyState(scrollY, directionDelta) {
    if (!lmsFeatureDetailsFilterBar || !document.body.classList.contains('lms-feature-details-mode')) return;

    const nextScrollY = Math.max(0, Number(scrollY) || 0);
    const delta = Number.isFinite(directionDelta) && directionDelta !== 0
      ? directionDelta
      : nextScrollY - lmsFeatureDetailsFilterLastScrollY;

    if (nextScrollY <= 12 || delta < -0.5) {
      setLmsFeatureDetailsFilterHeaderHidden(false);
    } else if (delta > 4 && nextScrollY > 92) {
      setLmsFeatureDetailsFilterHeaderHidden(true);
    }

    lmsFeatureDetailsFilterLastScrollY = nextScrollY;
  }

  function getLmsFeatureDetailsStickyOffset(headerWillBeHidden) {
    if (headerWillBeHidden) return 8;

    const fallbackHeaderHeight = window.matchMedia('(max-width: 720px)').matches ? 76 : 88;
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    return (headerHeight || fallbackHeaderHeight) + 8;
  }

  function cancelLmsFeatureDetailsScrollAnimation() {
    if (!lmsFeatureDetailsScrollAnimationFrame) return;

    window.cancelAnimationFrame(lmsFeatureDetailsScrollAnimationFrame);
    lmsFeatureDetailsScrollAnimationFrame = 0;
    setProposalInstantScrollMode(window, false);
  }

  function getLmsFeatureDetailsScrollDuration(distance) {
    return Math.max(950, Math.min(1950, 780 + Math.abs(distance) * 0.26));
  }

  function animateLmsFeatureDetailsScroll(targetY) {
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const safeTargetY = Math.max(0, Math.min(targetY, maxScrollY));
    const startY = window.scrollY;
    const distance = safeTargetY - startY;

    cancelLmsFeatureDetailsScrollAnimation();

    if (Math.abs(distance) < 2) {
      window.scrollTo({ top: safeTargetY, left: 0, behavior: 'auto' });
      return;
    }

    const duration = getLmsFeatureDetailsScrollDuration(distance);
    let startTime = 0;
    setProposalInstantScrollMode(window, true);

    function step(timestamp) {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(1, (timestamp - startTime) / duration);
      const nextY = startY + distance * easeProposalScroll(progress);
      setProposalWindowScrollY(window, nextY);

      if (progress < 1) {
        lmsFeatureDetailsScrollAnimationFrame = window.requestAnimationFrame(step);
        return;
      }

      lmsFeatureDetailsScrollAnimationFrame = 0;
      setProposalInstantScrollMode(window, false);
    }

    lmsFeatureDetailsScrollAnimationFrame = window.requestAnimationFrame(step);
  }

  function scrollLmsFeatureDetailsSectionToCenter(section) {
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollsDown = sectionTop > window.scrollY + 92;
    const stickyOffset = getLmsFeatureDetailsStickyOffset(scrollsDown);
    const filterHeight = lmsFeatureDetailsFilterBar ? lmsFeatureDetailsFilterBar.offsetHeight + 12 : 0;
    const availableHeight = Math.max(0, window.innerHeight - stickyOffset - filterHeight);
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const targetY = Math.max(0, Math.min(
      sectionTop - stickyOffset - filterHeight - Math.max(0, (availableHeight - rect.height) / 2),
      maxScrollY
    ));

    animateLmsFeatureDetailsScroll(targetY);
  }

  lmsFeatureDetailsFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      if (!lmsFeatureDetailsView || !lmsFeatureDetailsList) return;

      const targetCategory = filter.getAttribute('data-lms-feature-filter');
      const targetSection = lmsFeatureDetailsList.querySelector(`[data-lms-feature-category="${targetCategory}"]`);

      lmsFeatureDetailsList.classList.remove('is-filtered');
      lmsFeatureDetailsList.querySelectorAll('[data-lms-feature-category]').forEach(section => {
        section.hidden = false;
      });

      scrollLmsFeatureDetailsSectionToCenter(targetSection);
      notifyLayoutChange();
    });
  });

  window.addEventListener('wheel', cancelLmsFeatureDetailsScrollAnimation, { passive: true });
  window.addEventListener('touchstart', cancelLmsFeatureDetailsScrollAnimation, { passive: true });

  document.addEventListener('click', event => {
    if (!header || !header.classList.contains('header--nav-open')) return;
    if (header.contains(event.target)) return;
    closeHeaderNav();
  });

  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (header && header.classList.contains('header--nav-open')) {
      closeHeaderNav();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeHeaderNav();
  });

  proposalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      if (trigger.hasAttribute('data-proposal-footer-toggle') && document.body.classList.contains('proposal-mode')) {
        openLandingHome({ scrollBehavior: 'smooth' });
        return;
      }
      if (trigger.hasAttribute('data-proposal-footer-toggle') && document.body.classList.contains('blog-mode')) {
        openLandingHome({ scrollBehavior: 'smooth' });
        return;
      }
      if (trigger.hasAttribute('data-proposal-footer-toggle') && document.body.classList.contains('contact-mode')) {
        openLandingHome({ scrollBehavior: 'smooth' });
        return;
      }
      if (trigger.hasAttribute('data-proposal-footer-toggle') && document.body.classList.contains('lucky-mode')) {
        openLandingHome({ scrollBehavior: 'smooth' });
        return;
      }
      if (trigger.hasAttribute('data-proposal-footer-toggle') && document.body.classList.contains('lms-features-mode')) {
        openLandingHome({ scrollBehavior: 'smooth' });
        return;
      }
      setProposalMode(true);
    });
  });

  blogOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setBlogMode(true, { postSlug: '' });
    });
  });

  contactOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setContactMode(true);
    });
  });

  luckyOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setLuckyMode(true);
    });
  });

  document.querySelectorAll('[data-footer-contact-open]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      closeHeaderNav();
      setContactMode(true);
    });
  });

  function getAccessibleParentHref() {
    if (!isInIframe) return '';

    try {
      return window.parent && window.parent.location ? window.parent.location.href : '';
    } catch (error) {
      return '';
    }
  }

  function getContactMailEndpoint() {
    const contactForm = document.querySelector('[data-contact-form]');
    return (contactForm && contactForm.action) || NESSO_CONTACT_MAIL_ENDPOINT;
  }

  function getLuckySheetEndpoint() {
    const luckyForm = document.querySelector('[data-lucky-form]');
    return (luckyForm && luckyForm.action) || NESSO_LUCKY_SHEET_ENDPOINT;
  }

  function getContactPageUrl() {
    return getAccessibleParentHref() || window.location.href;
  }

  function getUtmParam(name) {
    const pageUrl = getContactPageUrl();
    const candidates = [window.location.href, pageUrl, document.referrer].filter(Boolean);

    for (const candidate of candidates) {
      try {
        const value = new URL(candidate, window.location.href).searchParams.get(name);
        if (value) return value;
      } catch (error) {
        // Ignore malformed referrer URLs.
      }
    }

    return '';
  }

  function setContactFormStatus(statusElement, message, type = '') {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.classList.toggle('contact-view__form-status--success', type === 'success');
    statusElement.classList.toggle('contact-view__form-status--error', type === 'error');
  }

  function isValidContactEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  function setContactInputInvalid(input, isInvalid) {
    if (!input) return;
    const field = input.closest('.contact-view__field');
    if (field) field.classList.toggle('contact-view__field--invalid', isInvalid);
    input.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  }

  function setContactConsentInvalid(input, isInvalid) {
    if (!input) return;
    const field = input.closest('.contact-view__consent');
    if (field) field.classList.toggle('contact-view__consent--invalid', isInvalid);
    input.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
  }

  function clearContactFormValidation(form) {
    if (!form) return;
    form.querySelectorAll('.contact-view__field--invalid').forEach(field => {
      field.classList.remove('contact-view__field--invalid');
    });
    form.querySelectorAll('.contact-view__consent--invalid').forEach(field => {
      field.classList.remove('contact-view__consent--invalid');
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach(input => {
      input.setAttribute('aria-invalid', 'false');
    });
  }

  function validateContactForm(form) {
    const statusElement = form.querySelector('[data-contact-form-status]');
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const acceptanceInput = form.querySelector('input[name="acceptance"]');
    const invalidFields = [];
    const nameInvalid = !nameInput || !String(nameInput.value || '').trim();
    const emailInvalid = !emailInput || !isValidContactEmail(emailInput.value);
    const acceptanceInvalid = !acceptanceInput || !acceptanceInput.checked;

    setContactInputInvalid(nameInput, nameInvalid);
    setContactInputInvalid(emailInput, emailInvalid);
    setContactConsentInvalid(acceptanceInput, acceptanceInvalid);

    if (emailInvalid && emailInput) invalidFields.push(emailInput);
    if (nameInvalid && nameInput) invalidFields.push(nameInput);
    if (acceptanceInvalid && acceptanceInput) invalidFields.push(acceptanceInput);

    if (!invalidFields.length) {
      setContactFormStatus(statusElement, '');
      return true;
    }

    setContactFormStatus(statusElement, 'Vui lòng nhập email, họ và tên và đánh dấu ô đồng ý trước khi gửi.', 'error');
    invalidFields[0].focus({ preventScroll: true });
    return false;
  }

  function bindContactFieldValidation(form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const acceptanceInput = form.querySelector('input[name="acceptance"]');
    const statusElement = form.querySelector('[data-contact-form-status]');

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        setContactInputInvalid(nameInput, !String(nameInput.value || '').trim());
        setContactFormStatus(statusElement, '');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        setContactInputInvalid(emailInput, !isValidContactEmail(emailInput.value));
        setContactFormStatus(statusElement, '');
      });
    }

    if (acceptanceInput) {
      acceptanceInput.addEventListener('change', () => {
        setContactConsentInvalid(acceptanceInput, !acceptanceInput.checked);
        setContactFormStatus(statusElement, '');
      });
    }
  }

  function resetContactFormSelects() {
    contactSelects.forEach(select => {
      const input = select.querySelector('[data-contact-select-input]');
      const valueLabel = select.querySelector('[data-contact-select-value]');
      const options = select.querySelectorAll('[data-contact-select-option]');
      const firstOption = options[0];
      if (!input || !valueLabel || !firstOption) return;

      const firstValue = firstOption.getAttribute('value') || firstOption.textContent.trim();
      input.value = firstValue;
      valueLabel.textContent = firstOption.textContent.trim();
      options.forEach(option => {
        const isActive = option === firstOption;
        option.classList.toggle('contact-view__select-option--active', isActive);
        option.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      closeContactSelect(select);
    });
  }

  async function submitContactForm(form) {
    const submitButton = form.querySelector('.contact-view__submit');
    const statusElement = form.querySelector('[data-contact-form-status]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    const formData = new FormData(form);
    const payload = new URLSearchParams();
    const pageUrl = getContactPageUrl();

    payload.set('submission_type', 'contact_mail');
    payload.set('name', String(formData.get('name') || '').trim());
    payload.set('email', String(formData.get('email') || '').trim());
    payload.set('website', String(formData.get('website') || '').trim());
    payload.set('service', String(formData.get('service') || '').trim());
    payload.set('message', String(formData.get('message') || '').trim());
    payload.set('acceptance', formData.get('acceptance') ? 'Đồng ý' : '');
    payload.set('page', pageUrl);
    payload.set('referrer', document.referrer || '');
    payload.set('utm_source', getUtmParam('utm_source'));
    payload.set('utm_medium', getUtmParam('utm_medium'));
    payload.set('utm_campaign', getUtmParam('utm_campaign'));

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Đang gửi...';
    }
    setContactFormStatus(statusElement, 'Đang gửi thông tin tư vấn...');

    try {
      const response = await fetch(getContactMailEndpoint(), {
        method: 'POST',
        body: payload,
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error('Contact mail request failed');
      }

      form.reset();
      resetContactFormSelects();
      clearContactFormValidation(form);
      setContactFormStatus(statusElement, 'Thông tin đã được gửi. Nesso sẽ liên hệ lại sớm.', 'success');
    } catch (error) {
      setContactFormStatus(statusElement, 'Chưa gửi được thông tin. Vui lòng thử lại sau.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || 'Gửi thông tin';
      }
    }
  }

  if (contactForm) {
    bindContactFieldValidation(contactForm);
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!validateContactForm(contactForm)) return;
      submitContactForm(contactForm);
    });
  }

  function closeContactSelect(select) {
    if (!select) return;
    const button = select.querySelector('[data-contact-select-button]');
    select.classList.remove('contact-view__field--select-open');
    if (button) button.setAttribute('aria-expanded', 'false');
  }

  function closeAllContactSelects(exceptSelect = null) {
    contactSelects.forEach(select => {
      if (select !== exceptSelect) closeContactSelect(select);
    });
  }

  contactSelects.forEach(select => {
    const button = select.querySelector('[data-contact-select-button]');
    const input = select.querySelector('[data-contact-select-input]');
    const valueLabel = select.querySelector('[data-contact-select-value]');
    const options = select.querySelectorAll('[data-contact-select-option]');

    if (!button || !input || !valueLabel || !options.length) return;

    button.addEventListener('click', event => {
      event.preventDefault();
      const shouldOpen = !select.classList.contains('contact-view__field--select-open');
      closeAllContactSelects(select);
      select.classList.toggle('contact-view__field--select-open', shouldOpen);
      button.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });

    options.forEach(option => {
      option.addEventListener('click', event => {
        event.preventDefault();
        const nextValue = option.getAttribute('value') || option.textContent.trim();
        input.value = nextValue;
        valueLabel.textContent = option.textContent.trim();
        options.forEach(item => {
          const isActive = item === option;
          item.classList.toggle('contact-view__select-option--active', isActive);
          item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        closeContactSelect(select);
        button.focus({ preventScroll: true });
      });
    });
  });

  document.addEventListener('click', event => {
    if (event.target.closest('[data-contact-select]')) return;
    closeAllContactSelects();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeAllContactSelects();
  });

  const luckyWheelState = {
    step: 'info',
    spinning: false,
    rotation: 0,
    result: null,
    submitted: false
  };
  const luckyWheelPrizes = [
    {
      id: 'content-30',
      title: 'Voucher 30% - Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      discount: '30%',
      serviceLabel: 'Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      weight: 90,
      centerAngle: 0
    },
    {
      id: 'content-20',
      title: 'Voucher 20% - Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      discount: '20%',
      serviceLabel: 'Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      weight: 10 / 3,
      centerAngle: 90
    },
    {
      id: 'content-15',
      title: 'Voucher 15% - Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      discount: '15%',
      serviceLabel: 'Dịch vụ Chuyển đổi nội dung (Gói Standard)',
      weight: 10 / 3,
      centerAngle: 180
    },
    {
      id: 'lms-10',
      title: 'Voucher 10% - Hệ thống LMS (Gói Standard)',
      discount: '10%',
      serviceLabel: 'Hệ thống LMS (Gói Standard)',
      weight: 10 / 3,
      centerAngle: 270
    }
  ];

  function setLuckyWheelStatus(message = '') {
    const status = luckyWheelView ? luckyWheelView.querySelector('[data-lucky-status]') : null;
    if (status) status.textContent = message;
  }


  function setLuckyStep(nextStep) {
    if (!luckyWheelView) return;
    luckyWheelState.step = nextStep;
    luckyWheelView.querySelectorAll('[data-lucky-panel]').forEach(panel => {
      const isActive = panel.getAttribute('data-lucky-panel') === nextStep;
      panel.hidden = !isActive;
    });
    const order = ['info', 'wheel', 'done'];
    const activeIndex = order.indexOf(nextStep);
    const stepsList = luckyWheelView.querySelector('.lucky-wheel-view__steps');
    if (stepsList) stepsList.setAttribute('data-lucky-progress', String(Math.max(0, activeIndex)));
    luckyWheelView.querySelectorAll('[data-lucky-step]').forEach(item => {
      const itemIndex = order.indexOf(item.getAttribute('data-lucky-step'));
      item.classList.toggle('lucky-wheel-view__step--active', itemIndex === activeIndex);
      item.classList.toggle('lucky-wheel-view__step--complete', itemIndex > -1 && itemIndex < activeIndex);
    });
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    notifyLayoutChange();
  }

  function clearLuckyValidation(form) {
    if (!form) return;
    form.querySelectorAll('.lucky-wheel-form__field--invalid').forEach(field => {
      field.classList.remove('lucky-wheel-form__field--invalid');
    });
    const consent = form.querySelector('.lucky-wheel-form__consent');
    if (consent) consent.classList.remove('lucky-wheel-form__consent--invalid');
    setLuckyWheelStatus('');
  }

  function setLuckyInputInvalid(input) {
    const field = input ? input.closest('.lucky-wheel-form__field') : null;
    if (field) field.classList.add('lucky-wheel-form__field--invalid');
  }

  function setLuckyConsentInvalid(form) {
    const consent = form ? form.querySelector('.lucky-wheel-form__consent') : null;
    if (consent) consent.classList.add('lucky-wheel-form__consent--invalid');
  }

  function validateLuckyForm(form, options = {}) {
    if (!form) return false;
    clearLuckyValidation(form);

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const consentInput = form.querySelector('input[name="acceptance"]');
    let firstInvalid = null;

    if (!nameInput || !nameInput.value.trim()) {
      setLuckyInputInvalid(nameInput);
      firstInvalid = firstInvalid || nameInput;
    }

    if (!emailInput || !isValidContactEmail(emailInput.value)) {
      setLuckyInputInvalid(emailInput);
      firstInvalid = firstInvalid || emailInput;
    }

    if (!consentInput || !consentInput.checked) {
      setLuckyConsentInvalid(form);
      firstInvalid = firstInvalid || consentInput;
    }

    if (firstInvalid) {
      if (options.showMessage !== false) {
        setLuckyWheelStatus('Vui lòng điền đầy đủ họ tên, email và xác nhận đồng ý trước khi tiếp tục.');
      }
      if (options.focus !== false && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus({ preventScroll: true });
      }
      return false;
    }

    return true;
  }

  function updateLuckyContinueState() {
    if (!luckyWheelView) return;
    const form = luckyWheelView.querySelector('[data-lucky-form]');
    const button = luckyWheelView.querySelector('[data-lucky-continue]');
    if (!form || !button) return;

    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const consentInput = form.querySelector('input[name="acceptance"]');
    button.disabled = !(nameInput && nameInput.value.trim() && emailInput && isValidContactEmail(emailInput.value) && consentInput && consentInput.checked);
  }

  function pickLuckyPrize() {
    const totalWeight = luckyWheelPrizes.reduce((sum, prize) => sum + prize.weight, 0);
    let cursor = Math.random() * totalWeight;
    for (const prize of luckyWheelPrizes) {
      cursor -= prize.weight;
      if (cursor <= 0) return prize;
    }
    return luckyWheelPrizes[0];
  }

  function getLuckyPageUrl() {
    const parentHref = getAccessibleParentHref();
    if (parentHref) return parentHref;
    return window.location.href;
  }

  function submitLuckyLead(prize) {
    if (!luckyWheelView || luckyWheelState.submitted) return Promise.resolve();
    const form = luckyWheelView.querySelector('[data-lucky-form]');
    if (!form) return Promise.resolve();

    luckyWheelState.submitted = true;
    const formData = new FormData(form);
    const payload = new URLSearchParams();
    payload.set('submission_type', 'lucky_wheel');
    payload.set('name', String(formData.get('name') || '').trim());
    payload.set('email', String(formData.get('email') || '').trim());
    payload.set('website', String(formData.get('website') || '').trim());
    payload.set('service', 'Vòng quay may mắn LMS');
    payload.set('message', prize ? ('Kết quả vòng quay: ' + prize.title) : 'Kết quả vòng quay: Voucher vòng quay may mắn LMS');
    payload.set('prize_id', prize ? prize.id : '');
    payload.set('prize_title', prize ? prize.title : '');
    payload.set('prize_discount', prize ? prize.discount : '');
    payload.set('prize_service', prize ? prize.serviceLabel : '');
    payload.set('prize_weight', prize ? String(prize.weight) : '');
    payload.set('send_prize_email', prize ? 'yes' : '');
    payload.set('acceptance', formData.get('acceptance') ? 'Đồng ý' : '');
    payload.set('page', getLuckyPageUrl());
    payload.set('referrer', document.referrer || '');
    payload.set('utm_source', getUtmParam('utm_source'));
    payload.set('utm_medium', getUtmParam('utm_medium'));
    payload.set('utm_campaign', getUtmParam('utm_campaign'));

    return fetch(getLuckySheetEndpoint(), {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    }).catch(() => undefined);
  }

  function finishLuckySpin(prize) {
    luckyWheelState.spinning = false;
    luckyWheelState.result = prize;
    const wheel = luckyWheelView ? luckyWheelView.querySelector('[data-lucky-wheel-image]') : null;
    const spinButton = luckyWheelView ? luckyWheelView.querySelector('[data-lucky-spin]') : null;
    const result = luckyWheelView ? luckyWheelView.querySelector('[data-lucky-result]') : null;

    if (wheel) wheel.classList.remove('lucky-wheel-stage__wheel--spinning');
    if (spinButton) spinButton.disabled = false;
    if (result && prize) {
      const displayTitle = prize.title.replace(/^Voucher\s+(\d+%)/, 'Voucher giảm $1');
      result.hidden = false;
      result.innerHTML = `Chúc mừng bạn đã nhận được <strong>${displayTitle}</strong>.`;
    }

    setLuckyStep('done');
    submitLuckyLead(prize);
  }

  function spinLuckyWheel() {
    if (!luckyWheelView || luckyWheelState.spinning || luckyWheelState.step !== 'wheel') return;
    const wheel = luckyWheelView.querySelector('[data-lucky-wheel-image]');
    const spinButton = luckyWheelView.querySelector('[data-lucky-spin]');
    if (!wheel) return;

    luckyWheelState.spinning = true;
    const prize = pickLuckyPrize();
    const jitter = (Math.random() * 26) - 13;
    const targetAngle = (360 - prize.centerAngle + jitter + 360) % 360;
    const nextRotation = luckyWheelState.rotation + (360 * 6) + targetAngle;
    luckyWheelState.rotation = nextRotation;

    if (spinButton) spinButton.disabled = true;
    wheel.classList.add('lucky-wheel-stage__wheel--spinning');
    wheel.style.setProperty('--lucky-wheel-rotation', `${nextRotation}deg`);

    window.setTimeout(() => finishLuckySpin(prize), 4300);
  }

  function setLuckySecurityTooltip(open = false) {
    if (!luckyWheelView) return;
    const legal = luckyWheelView.querySelector('.lucky-wheel-form__legal');
    const trigger = luckyWheelView.querySelector('[data-lucky-security-toggle]');
    if (!legal || !trigger) return;
    legal.classList.toggle('lucky-wheel-form__legal--tooltip-open', Boolean(open));
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function resetLuckyWheelView() {
    if (!luckyWheelView) return;
    const form = luckyWheelView.querySelector('[data-lucky-form]');
    const wheel = luckyWheelView.querySelector('[data-lucky-wheel-image]');
    const spinButton = luckyWheelView.querySelector('[data-lucky-spin]');
    const result = luckyWheelView.querySelector('[data-lucky-result]');

    luckyWheelState.step = 'info';
    luckyWheelState.spinning = false;
    luckyWheelState.rotation = 0;
    luckyWheelState.result = null;
    luckyWheelState.submitted = false;

    if (form) {
      form.reset();
      clearLuckyValidation(form);
    }
    if (wheel) {
      wheel.classList.remove('lucky-wheel-stage__wheel--spinning');
      wheel.style.setProperty('--lucky-wheel-rotation', '0deg');
    }
    if (spinButton) spinButton.disabled = false;
    if (result) {
      result.hidden = true;
      result.textContent = '';
    }
    setLuckySecurityTooltip(false);
    updateLuckyContinueState();
    setLuckyStep('info');
  }

  if (luckyWheelView) {
    const luckyForm = luckyWheelView.querySelector('[data-lucky-form]');
    const luckyStage = luckyWheelView.querySelector('[data-lucky-stage]');
    const luckyHomeButton = luckyWheelView.querySelector('[data-lucky-home]');

    if (luckyForm) {
      const luckySecurityToggle = luckyForm.querySelector('[data-lucky-security-toggle]');
      if (luckySecurityToggle) {
        luckySecurityToggle.addEventListener('click', event => {
          event.preventDefault();
          const legal = luckySecurityToggle.closest('.lucky-wheel-form__legal');
          setLuckySecurityTooltip(!(legal && legal.classList.contains('lucky-wheel-form__legal--tooltip-open')));
        });
      }

      luckyForm.addEventListener('input', event => {
        const field = event.target.closest('.lucky-wheel-form__field');
        if (field) field.classList.remove('lucky-wheel-form__field--invalid');
        updateLuckyContinueState();
      });
      luckyForm.addEventListener('change', event => {
        if (event.target.matches('input[name="acceptance"]')) {
          const consent = event.target.closest('.lucky-wheel-form__consent');
          if (consent) consent.classList.remove('lucky-wheel-form__consent--invalid');
        }
        updateLuckyContinueState();
      });
      luckyForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!validateLuckyForm(luckyForm)) {
          updateLuckyContinueState();
          return;
        }
        setLuckyStep('wheel');
      });
    }

    if (luckyStage) {
      luckyStage.addEventListener('click', event => {
        event.preventDefault();
        spinLuckyWheel();
      });
    }

    if (luckyHomeButton) {
      luckyHomeButton.addEventListener('click', event => {
        event.preventDefault();
        openLandingHome({ scrollBehavior: 'smooth' });
      });
    }

    document.addEventListener('click', event => {
      if (!luckyWheelView || event.target.closest('.lucky-wheel-form__legal')) return;
      setLuckySecurityTooltip(false);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') setLuckySecurityTooltip(false);
    });

    resetLuckyWheelView();
  }
  document.querySelectorAll('[data-blog-category="all"]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      lmsBlogState.activeCategory = 'all';
      lmsBlogState.activeSlug = '';
      syncBlogRoute('');
      renderLmsBlog();
    });
  });

  if (blogSearchInput) {
    blogSearchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });

    blogSearchInput.addEventListener('input', () => {
      lmsBlogState.searchTerm = blogSearchInput.value || '';
      lmsBlogState.activeSlug = '';
      if (lmsBlogState.searchTerm.trim()) {
        lmsBlogState.activeCategory = 'all';
      }
      syncBlogRoute('');
      renderLmsBlog();
    });

    blogSearchInput.addEventListener('search', () => {
      lmsBlogState.searchTerm = blogSearchInput.value || '';
      lmsBlogState.activeSlug = '';
      if (lmsBlogState.searchTerm.trim()) {
        lmsBlogState.activeCategory = 'all';
      }
      syncBlogRoute('');
      renderLmsBlog();
    });
  }

  window.addEventListener('nesso-lms-language-change', () => {
    if (!blogView || !document.body.classList.contains('blog-mode')) return;
    renderLmsBlog();
    window.requestAnimationFrame(notifyLayoutChange);
    window.setTimeout(notifyLayoutChange, 180);
  });

  proposalMenuLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const slideIndex = Number(link.dataset.proposalMenuLink) || 1;
      const targetSlide = proposalSlides.find(slide => Number(slide.dataset.proposalSlide) === slideIndex);
      updateProposalSlide(slideIndex - 1);
      scrollToProposalSlide(targetSlide);
    });
  });

  if (headerLogo) {
    headerLogo.addEventListener('click', event => {
      event.preventDefault();
      openLandingHome();
    });
  }

  function applyHashRouteFromLocation() {
    const imageRouteCode = getImageRouteCodeFromHash();
    if (imageRouteCode) {
      setImageRouteMode(true, imageRouteCode, { syncRoute: false });
      return true;
    }

    if (isLmsFeatureDetailsHash()) {
      setLmsFeatureDetailsMode(true, { syncRoute: false });
      return true;
    }

    if (isLmsFeaturesHash()) {
      setLmsFeaturesMode(true, { syncRoute: false });
      return true;
    }

    if (window.location.hash === '#proposal-view') {
      setProposalMode(true, { syncRoute: false });
      return true;
    }

    if (isBlogHash()) {
      setBlogMode(true, {
        postSlug: getBlogSlugFromHash(),
        syncRoute: false
      });
      return true;
    }

    if (isContactHash()) {
      setContactMode(true, { syncRoute: false });
      return true;
    }

    if (isLuckyHash()) {
      setLuckyMode(true, { syncRoute: false });
      return true;
    }

    return false;
  }

  applyHashRouteFromLocation();

  window.addEventListener('hashchange', () => {
    if (applyHashRouteFromLocation()) return;
    if (!isInIframe) {
      openLandingHome({ notifyParent: false, scrollBehavior: 'auto' });
    }
  });

  function isProposalModeActive() {
    return proposalView && document.body.classList.contains('proposal-mode') && !proposalView.hidden;
  }

  function useProposalVirtualScroll() {
    return false;
  }

  function clampPageScrollY(scrollY) {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(scrollY, maxScroll));
  }

  function getProposalActivationTolerance(viewportH) {
    if (window.matchMedia('(max-width: 768px)').matches) {
      return Math.max(18, Math.min(44, viewportH * 0.045));
    }

    if (window.matchMedia('(max-width: 1024px)').matches) {
      return Math.max(16, Math.min(40, viewportH * 0.04));
    }

    return Math.max(14, Math.min(36, viewportH * 0.035));
  }

  function getProposalSlideZoneState() {
    const anchor = proposalScrollAnchor || proposalView;
    if (!anchor) return null;

    const viewportH = isInIframe ? parentProposalViewportH : window.innerHeight;
    const viewportCenter = viewportH * 0.5;
    const tolerance = getProposalActivationTolerance(viewportH);
    const rect = anchor.getBoundingClientRect();
    const anchorDocumentCenter = isInIframe
      ? rect.top + rect.height * 0.5
      : window.scrollY + rect.top + rect.height * 0.5;
    const anchorCenter = isInIframe
      ? anchorDocumentCenter - parentProposalScrollY
      : rect.top + rect.height * 0.5;

    return {
      distance: anchorCenter - viewportCenter,
      lockScrollY: Math.max(0, anchorDocumentCenter - viewportCenter),
      tolerance
    };
  }

  function notifyProposalScrollState() {
    if (!isInIframe) return;

    window.parent.postMessage({
      type: 'NESSO_PROPOSAL_SCROLL_STATE',
      ready: proposalScrollCaptureReady,
      activeIndex: activeProposalSlide,
      total: proposalSlides.length,
      lockScrollY: proposalLockScrollY,
      lockTolerance: proposalLockTolerance
    }, '*');
  }

  function updateProposalScrollCaptureState() {
    if (!useProposalVirtualScroll()) {
      proposalScrollCaptureReady = false;
      proposalLockTolerance = 0;
      lastProposalCenterDistance = null;
      return false;
    }

    const wasReady = proposalScrollCaptureReady;
    const zoneState = isProposalModeActive() && useProposalVirtualScroll() ? getProposalSlideZoneState() : null;
    let crossedCenter = false;
    let reachedLockWindow = false;

    if (zoneState) {
      proposalLockScrollY = zoneState.lockScrollY;
      proposalLockTolerance = zoneState.tolerance;
      crossedCenter = lastProposalCenterDistance !== null && (
        (lastProposalCenterDistance > 0 && zoneState.distance <= 0) ||
        (lastProposalCenterDistance < 0 && zoneState.distance >= 0)
      );

      if (pendingProposalScrollDirection && canMoveProposalSlide(pendingProposalScrollDirection)) {
        const currentScrollY = isInIframe ? parentProposalScrollY : window.scrollY;
        reachedLockWindow = pendingProposalScrollDirection > 0
          ? currentScrollY >= zoneState.lockScrollY
          : currentScrollY <= zoneState.lockScrollY;
      }

      proposalScrollCaptureReady = Math.abs(zoneState.distance) <= zoneState.tolerance || crossedCenter || reachedLockWindow;
      lastProposalCenterDistance = zoneState.distance;
    } else {
      proposalScrollCaptureReady = false;
      proposalLockTolerance = 0;
      lastProposalCenterDistance = null;
    }

    if (proposalScrollCaptureReady && !wasReady) {
      if (!isInIframe) {
        snapStandaloneProposalLock(proposalLockScrollY);
      }

      if (pendingProposalScrollDirection) {
        pendingProposalScrollDirection = 0;
      }
    }

    notifyProposalScrollState();
    return proposalScrollCaptureReady;
  }

  function snapStandaloneProposalLock(targetY) {
    if (isInIframe) return;

    if (proposalLockAnimationFrame) {
      window.cancelAnimationFrame(proposalLockAnimationFrame);
      proposalLockAnimationFrame = 0;
    }

    const lockY = clampPageScrollY(targetY);
    proposalLocking = true;
    window.scrollTo({ top: lockY, left: 0, behavior: 'auto' });
    proposalLockAnimationFrame = window.requestAnimationFrame(() => {
      proposalLockAnimationFrame = 0;
      proposalLocking = false;
    });
  }

  function shouldLockStandaloneOnProposalCenter(direction, nextScrollY) {
    if (isInIframe || !isProposalModeActive()) return false;

    const zoneState = getProposalSlideZoneState();
    if (!zoneState) return false;

    proposalLockScrollY = clampPageScrollY(zoneState.lockScrollY);
    proposalLockTolerance = zoneState.tolerance;
    const currentScrollY = window.scrollY;
    const snapBuffer = Math.min(18, zoneState.tolerance);
    if (direction > 0) {
      return currentScrollY <= proposalLockScrollY + snapBuffer && nextScrollY >= proposalLockScrollY - snapBuffer;
    }

    return currentScrollY >= proposalLockScrollY - snapBuffer && nextScrollY <= proposalLockScrollY + snapBuffer;
  }

  function handleStandaloneProposalVirtualScroll(direction, deltaY, event) {
    if (isInIframe || !useProposalVirtualScroll()) return false;
    if (event && event.cancelable) event.preventDefault();

    if (!proposalScrollCaptureReady) {
      const nextScrollY = clampPageScrollY(window.scrollY + deltaY);

      if (shouldLockStandaloneOnProposalCenter(direction, nextScrollY)) {
        lockStandaloneProposalAtCenter(event);
        return true;
      }

      window.scrollTo({ top: nextScrollY, left: 0, behavior: 'auto' });
      updateProposalScrollCaptureState();
      return true;
    }

    if (handleProposalScrollNavigation(direction, event)) {
      return true;
    }

    proposalScrollCaptureReady = false;
    lastProposalCenterDistance = null;
    notifyProposalScrollState();
    window.scrollTo({
      top: clampPageScrollY(window.scrollY + deltaY),
      left: 0,
      behavior: 'auto'
    });
    return true;
  }

  function lockStandaloneProposalAtCenter(event) {
    if (event && event.cancelable) event.preventDefault();

    pendingProposalScrollDirection = 0;
    proposalScrollCaptureReady = true;
    snapStandaloneProposalLock(proposalLockScrollY);
    updateProposalScrollCaptureState();
    return true;
  }

  function scrollToProposalFooter() {
    if (!proposalFooter) return;
    proposalFooter.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function releaseParentProposalScroll(direction) {
    if (!isInIframe) return;

    window.parent.postMessage({
      type: 'NESSO_PROPOSAL_RELEASE',
      direction
    }, '*');
  }

  function handleProposalTouchNavigation() {
    return false;
  }

  function handleProposalScrollNavigation(direction, event) {
    if (!isProposalModeActive() || !updateProposalScrollCaptureState()) return false;
    if (!proposalSlides.length) return false;

    if (proposalLocking) {
      if (event && event.cancelable) event.preventDefault();
      return true;
    }

    if (proposalSlideLocked) {
      if (event && event.cancelable) event.preventDefault();
      return true;
    }

    const moved = moveProposalSlide(direction);
    if (moved) {
      if (event && event.cancelable) event.preventDefault();
      return true;
    }

    if (direction > 0 && activeProposalSlide === proposalSlides.length - 1) {
      if (event && event.cancelable) event.preventDefault();
      if (isInIframe) {
        releaseParentProposalScroll(direction);
      } else {
        scrollToProposalFooter();
      }
      return true;
    }

    if (isInIframe && direction < 0 && activeProposalSlide === 0) {
      if (event && event.cancelable) event.preventDefault();
      releaseParentProposalScroll(direction);
      return true;
    }

    if (direction < 0 && activeProposalSlide === 0 && window.scrollY <= 2) {
      if (event && event.cancelable) event.preventDefault();
      return true;
    }

    return false;
  }

  window.addEventListener('wheel', event => {
    if (!isProposalModeActive()) return;
    if (Math.abs(event.deltaY) < 2) return;
    cancelProposalScrollAnimation();
    const direction = event.deltaY > 0 ? 1 : -1;

    if (isInIframe && useProposalVirtualScroll()) {
      if (event.cancelable) event.preventDefault();
      window.parent.postMessage({
        type: 'NESSO_PROPOSAL_PARENT_WHEEL',
        direction,
        deltaY: event.deltaY
      }, '*');
      return;
    }

    if (handleStandaloneProposalVirtualScroll(direction, event.deltaY, event)) {
      return;
    }

    if (!handleProposalScrollNavigation(direction, event) && !proposalScrollCaptureReady) {
      pendingProposalScrollDirection = direction;
    }
  }, { passive: false });

  window.addEventListener('touchstart', event => {
    if (!isProposalModeActive() || !event.touches.length) return;
    cancelProposalScrollAnimation();
    proposalTouchStartX = event.touches[0].clientX;
    proposalTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', event => {
    if (!isProposalModeActive() || !event.changedTouches.length) return;

    const touch = event.changedTouches[0];
    const deltaX = proposalTouchStartX - touch.clientX;
    const deltaY = proposalTouchStartY - touch.clientY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (Math.max(absX, absY) < 32) return;
    const direction = absX >= absY
      ? (deltaX > 0 ? 1 : -1)
      : (deltaY > 0 ? 1 : -1);

    if (!useProposalVirtualScroll() && handleProposalTouchNavigation(direction, event)) {
      return;
    }

    if (!handleProposalScrollNavigation(direction, event) && !proposalScrollCaptureReady) {
      pendingProposalScrollDirection = direction;
    }
  }, { passive: false });

  window.addEventListener('message', event => {
    if (!event.data) return;

    if (event.data.type === 'NESSO_PROPOSAL_GOTO') {
      const targetIndex = Math.max(0, Math.min((Number(event.data.index) || 1) - 1, proposalSlides.length - 1));
      const targetSlide = proposalSlides[targetIndex];
      updateProposalSlide(targetIndex);
      scrollToProposalSlide(targetSlide);
      return;
    }

    if (event.data.type === 'NESSO_BLOG_CATEGORY_GOTO') {
      lmsBlogState.activeCategory = String(event.data.category || 'all');
      lmsBlogState.activeSlug = '';
      syncBlogRoute('');
      renderLmsBlog();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    if (event.data.type === 'NESSO_PARENT_SCROLL') {
      const wasParentManaged = proposalParentMenuManaged;
      proposalParentMenuManaged = event.data.menuHandled === true;
      if (wasParentManaged && !proposalParentMenuManaged) {
        resetProposalMenuStickyMetrics();
      }
      parentProposalScrollY = Number(event.data.scrollY) || 0;
      parentProposalViewportH = Number(event.data.viewportH) || window.innerHeight;
      if (event.data.mode === 'landing' || !event.data.mode) {
        updateStickyHeader(parentProposalScrollY, 0, { parentManaged: true });
      } else if (stickyHeaderParentManaged) {
        setStickyHeaderParentManaged(false, 0);
      }
      if (event.data.mode === 'blog' && event.data.blogHandled !== true) {
        updateBlogSidebarStickyPosition();
      } else if (event.data.mode !== 'blog') {
        resetBlogSidebarStickyMetrics();
      }
      if (!proposalParentMenuManaged) {
        updateProposalMenuStickyPosition();
      }
      requestProposalActiveFromScroll();
      return;
    }

    if (event.data.type === 'NESSO_PROPOSAL_SCROLL') {
      handleProposalScrollNavigation(event.data.direction > 0 ? 1 : -1, event);
    }
  });

  window.addEventListener('scroll', () => {
    updateStickyHeader(window.scrollY, 0, { parentManaged: false });
    updateLmsFeatureDetailsFilterStickyState(window.scrollY, 0);
    if (isParentHeaderManaged && isInIframe
      && !document.body.classList.contains('proposal-mode')
      && !document.body.classList.contains('blog-mode')
      && !document.body.classList.contains('contact-mode')
      && !document.body.classList.contains('lms-features-mode')
      && !document.body.classList.contains('lms-feature-details-mode')
      && !document.body.classList.contains('lucky-mode')
      && !document.body.classList.contains('image-route-mode')
      && !document.body.classList.contains('demo-embed-mode')) {
      const nextLandingScrollY = window.scrollY;
      const deltaY = nextLandingScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextLandingScrollY;
      window.parent.postMessage({
        type: 'NESSO_LANDING_SCROLL',
        scrollY: nextLandingScrollY,
        deltaY
      }, '*');
    }
    if (isParentHeaderManaged && document.body.classList.contains('lms-features-mode') && isInIframe) {
      const nextFeaturesScrollY = window.scrollY;
      const deltaY = nextFeaturesScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextFeaturesScrollY;
      window.parent.postMessage({
        type: 'NESSO_FEATURES_SCROLL',
        scrollY: nextFeaturesScrollY,
        deltaY
      }, '*');
    }
    if (isParentHeaderManaged && document.body.classList.contains('lms-feature-details-mode') && isInIframe) {
      const nextFeatureDetailsScrollY = window.scrollY;
      const deltaY = nextFeatureDetailsScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextFeatureDetailsScrollY;
      window.parent.postMessage({
        type: 'NESSO_FEATURE_DETAILS_SCROLL',
        scrollY: nextFeatureDetailsScrollY,
        deltaY
      }, '*');
    }
    if (isParentHeaderManaged && document.body.classList.contains('blog-mode') && isInIframe) {
      const nextBlogScrollY = window.scrollY;
      const deltaY = nextBlogScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextBlogScrollY;
      window.parent.postMessage({
        type: 'NESSO_BLOG_SCROLL',
        scrollY: nextBlogScrollY,
        deltaY
      }, '*');
    }
    if (isParentHeaderManaged && document.body.classList.contains('contact-mode') && isInIframe) {
      const nextContactScrollY = window.scrollY;
      const deltaY = nextContactScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextContactScrollY;
      window.parent.postMessage({
        type: 'NESSO_CONTACT_SCROLL',
        scrollY: nextContactScrollY,
        deltaY
      }, '*');
    }
    if (isParentHeaderManaged && document.body.classList.contains('lucky-mode') && isInIframe) {
      const nextLuckyScrollY = window.scrollY;
      const deltaY = nextLuckyScrollY - blogParentLastScrollY;
      blogParentLastScrollY = nextLuckyScrollY;
      window.parent.postMessage({
        type: 'NESSO_LUCKY_SCROLL',
        scrollY: nextLuckyScrollY,
        deltaY
      }, '*');
    }
    if (isProposalModeActive()) requestProposalActiveFromScroll();
  }, { passive: true });

  window.addEventListener('wheel', event => {
    if (!header || Math.abs(event.deltaY) < 1) return;

    const scrollY = isInIframe && stickyHeaderParentManaged ? parentProposalScrollY : window.scrollY;

    if (event.deltaY < 0) {
      setStickyHeaderHidden(false);
      stickyHeaderLastScrollY = scrollY;
      return;
    }

    if (scrollY > 92) {
      setStickyHeaderHidden(true);
    }
  }, { passive: true });

  window.addEventListener('wheel', event => {
    if (!isParentHeaderManaged || !isInIframe) return;
    if (window.matchMedia('(max-width: 1024px)').matches) return;
    if (document.body.classList.contains('proposal-mode')
      || document.body.classList.contains('blog-mode')
      || document.body.classList.contains('contact-mode')
      || document.body.classList.contains('lms-features-mode')
      || document.body.classList.contains('lms-feature-details-mode')
      || document.body.classList.contains('lucky-mode')
      || document.body.classList.contains('image-route-mode')
      || document.body.classList.contains('demo-embed-mode')) {
      return;
    }
    if (Math.abs(event.deltaY) < 1) return;

    event.preventDefault();
    window.parent.postMessage({
      type: 'NESSO_PARENT_WHEEL',
      deltaY: event.deltaY
    }, '*');
  }, { passive: false });

  window.addEventListener('resize', () => {
    resetBlogSidebarStickyMetrics();
    updateBlogSidebarStickyPosition();

    if (!isProposalModeActive()) return;
    resetProposalMenuStickyMetrics();
    requestProposalActiveFromScroll();
  });

  proposalSlides.forEach(slide => {
    if (slide.complete) return;
    slide.addEventListener('load', () => {
      resetProposalMenuStickyMetrics();
      requestProposalActiveFromScroll();
    }, { once: true });
  });

  window.addEventListener('keydown', event => {
    if (!isProposalModeActive()) return;

    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
      handleProposalScrollNavigation(1, event);
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      handleProposalScrollNavigation(-1, event);
    }
  });

  // Pricing cards — auto-activate hover on scroll (mobile)
  const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;
  if (isTouchDevice) {
    const cards = document.querySelectorAll('.pricing__card');
    if (cards.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pricing__card--active');
          } else {
            entry.target.classList.remove('pricing__card--active');
          }
        });
      }, {
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.3
      });
      cards.forEach(card => observer.observe(card));
    }
  }

  // Logo marquee — seamless loop fix
  // Pricing tabs
  const pricingSwitch = document.querySelector('.pricing__switch');
  const pricingTabs = document.querySelectorAll('[data-pricing-tab]');
  const pricingPanels = document.querySelectorAll('[data-pricing-panel]');
  if (pricingTabs.length && pricingPanels.length) {
    let activePricingPanel = Array.from(pricingPanels).find(panel => !panel.hidden) || pricingPanels[0];
    let isPricingPanelAnimating = false;

    function activatePricingTab(tabName) {
      const nextPanel = Array.from(pricingPanels).find(panel => panel.dataset.pricingPanel === tabName);
      if (!nextPanel || nextPanel === activePricingPanel || isPricingPanelAnimating) return;

      if (pricingSwitch) {
        pricingSwitch.classList.toggle('pricing__switch--lms', tabName === 'lms');
        pricingSwitch.classList.toggle('pricing__switch--content', tabName === 'content');
      }

      pricingTabs.forEach(tab => {
        const isActive = tab.dataset.pricingTab === tabName;
        tab.classList.toggle('pricing__switch-option--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      isPricingPanelAnimating = true;
      const previousPanel = activePricingPanel;
      previousPanel.classList.remove('pricing__panel--active', 'pricing__panel--enter');
      previousPanel.classList.add('pricing__panel--exit');

      window.setTimeout(() => {
        previousPanel.hidden = true;
        previousPanel.classList.remove('pricing__panel--exit');

        nextPanel.hidden = false;
        nextPanel.classList.add('pricing__panel--enter');
        requestAnimationFrame(() => {
          nextPanel.classList.remove('pricing__panel--enter');
          nextPanel.classList.add('pricing__panel--active');
          activePricingPanel = nextPanel;
        });

        window.setTimeout(() => {
          isPricingPanelAnimating = false;
        }, 360);
      }, 220);
    }

    pricingTabs.forEach(tab => {
      tab.addEventListener('click', () => activatePricingTab(tab.dataset.pricingTab));
    });
  }

  const pricingContentPages = document.querySelectorAll('[data-pricing-content-page]');
  const pricingContentTriggers = document.querySelectorAll('[data-pricing-content-trigger]');
  if (pricingContentPages.length && pricingContentTriggers.length) {
    let activePricingContentPage = Array.from(pricingContentPages).find(page => !page.hidden) || pricingContentPages[0];
    let isPricingContentAnimating = false;
    const pricingContentPageNumbers = Array.from(pricingContentPages)
      .map(page => page.dataset.pricingContentPage)
      .sort((a, b) => Number(a) - Number(b));

    function updatePricingContentDots(pageNumber) {
      pricingContentTriggers.forEach(trigger => {
        const isActive = trigger.dataset.pricingContentTrigger === pageNumber;
        trigger.classList.toggle('pricing__pager-dot--active', isActive && trigger.classList.contains('pricing__pager-dot'));
        trigger.classList.toggle('pricing__plan-button--active', isActive && trigger.classList.contains('pricing__plan-button'));
        if (isActive) {
          trigger.setAttribute('aria-current', 'true');
        } else {
          trigger.removeAttribute('aria-current');
        }
      });
    }

    function activatePricingContentPage(pageNumber) {
      const nextPage = Array.from(pricingContentPages).find(page => page.dataset.pricingContentPage === pageNumber);
      if (!nextPage || nextPage === activePricingContentPage || isPricingContentAnimating) return;

      isPricingContentAnimating = true;
      updatePricingContentDots(pageNumber);

      const previousPage = activePricingContentPage;
      previousPage.classList.remove('pricing__content-page--active', 'pricing__content-page--enter');
      previousPage.classList.add('pricing__content-page--exit');

      window.setTimeout(() => {
        previousPage.hidden = true;
        previousPage.classList.remove('pricing__content-page--exit');

        nextPage.hidden = false;
        nextPage.classList.add('pricing__content-page--enter');
        requestAnimationFrame(() => {
          nextPage.classList.remove('pricing__content-page--enter');
          nextPage.classList.add('pricing__content-page--active');
          activePricingContentPage = nextPage;
        });

        window.setTimeout(() => {
          isPricingContentAnimating = false;
        }, 520);
      }, 260);
    }

    updatePricingContentDots(activePricingContentPage.dataset.pricingContentPage);

    pricingContentTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        if (trigger.disabled) return;
        activatePricingContentPage(trigger.dataset.pricingContentTrigger);
      });
    });

    const pricingContentPanel = document.querySelector('#pricing-content-panel');
    if (pricingContentPanel) {
      let swipeStartX = 0;
      let swipeStartY = 0;

      function activateAdjacentPricingContentPage(direction) {
        const currentIndex = pricingContentPageNumbers.indexOf(activePricingContentPage.dataset.pricingContentPage);
        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= pricingContentPageNumbers.length) return;
        activatePricingContentPage(pricingContentPageNumbers[nextIndex]);
      }

      pricingContentPanel.addEventListener('touchstart', event => {
        const touch = event.touches[0];
        swipeStartX = touch.clientX;
        swipeStartY = touch.clientY;
      }, { passive: true });

      pricingContentPanel.addEventListener('touchend', event => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - swipeStartX;
        const deltaY = touch.clientY - swipeStartY;
        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
        activateAdjacentPricingContentPage(deltaX < 0 ? 1 : -1);
      }, { passive: true });
    }
  }

  const track = document.querySelector('.logo-section__track');
  if (track) {
    const wraps = track.querySelectorAll('.logo-section__logo-wrap');
    const half = wraps.length / 2;
    const gap = 69;
    let totalWidth = 0;
    for (let i = 0; i < half; i++) {
      totalWidth += wraps[i].offsetWidth;
    }
    totalWidth += half * gap;
    track.style.setProperty('--marquee-distance', `-${totalWidth}px`);
  }

  // Hero and proposal visual accents follow the pointer.
  const heroBadges = document.querySelectorAll('.hero__visual-badge, .proposal-dynamic-slide__asset, .proposal-advantage-slide__asset, .proposal-pricing-slide__asset, .proposal-lms-slide__asset, .proposal-storage-slide__asset, .proposal-final-slide__asset');
  if (heroBadges.length) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;
    const maxShiftX = 10;
    const maxShiftY = 6;
    const easing = 0.075;

    function applyHeroBadgeMotion() {
      currentX += (targetX - currentX) * easing;
      currentY += (targetY - currentY) * easing;

      heroBadges.forEach((badge, index) => {
        const explicitDepth = Number.parseFloat(badge.getAttribute('data-pointer-depth'));
        const depth = Number.isFinite(explicitDepth) ? explicitDepth : (index === 0 ? 1 : 1.04);
        badge.style.setProperty('--badge-shift-x', `${(currentX * depth).toFixed(2)}px`);
        badge.style.setProperty('--badge-shift-y', `${(currentY * depth).toFixed(2)}px`);
      });

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        rafId = requestAnimationFrame(applyHeroBadgeMotion);
      } else {
        rafId = 0;
      }
    }

    function requestHeroBadgeMotion() {
      if (!rafId) rafId = requestAnimationFrame(applyHeroBadgeMotion);
    }

    function moveHeroBadges(event) {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      targetX = Math.max(-1, Math.min(1, x)) * maxShiftX;
      targetY = Math.max(-1, Math.min(1, y)) * maxShiftY;
      requestHeroBadgeMotion();
    }

    function resetHeroBadges() {
      targetX = 0;
      targetY = 0;
      requestHeroBadgeMotion();
    }

    window.addEventListener('mousemove', moveHeroBadges, { passive: true });
    document.addEventListener('mouseleave', resetHeroBadges);
  }

  // === Scroll Reveal Setup ===
  const sections = document.querySelectorAll(
    '.logo-section, .usp-section, .features, .ecosystem, .core-values, .pricing, .testimonials, .cta-section, .cta-final, .footer'
  );

  const componentRevealSelector = [
    '.logo-section__badge-row',
    '.logo-section__logos',
    '.logo-section__divider',
    '.usp-card',
    '.core-values__left',
    '.core-values__right',
    '.core-values__card',
    '.ecosystem__wrapper',
    '.ecosystem__left',
    '.ecosystem__card',
    '.features__card',
    '.pricing__switch',
    '.pricing__lms-card',
    '.pricing__mini-card',
    '.testimonials__wrapper',
    '.cta-final__content',
    '.footer__card'
  ].join(', ');

  const standaloneRevealSelector = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'p',
    '[class*="__heading"]',
    '[class*="__subtitle"]',
    '[class*="__badge"]',
    '[class*="__pill"]',
    '[class*="__effect"]',
    '[class*="__grid"] > *',
    '[class*="__cards"] > *',
    '[class*="__divider"]',
    '[class*="__brand"]',
    '[class*="__links"]',
    '[class*="__top"]',
    '.usp-pill',
    '.usp-card__left',
    '.usp-card__star'
  ].join(', ');

  function shouldSkipReveal(el) {
    return (
      el.closest('.hero') ||
      el.closest('.logo-section__track') ||
      el.closest('nav') ||
      el.closest('.footer__bottom') ||
      el.classList.contains('footer__bottom')
    );
  }

  function addReveal(el, isComponent = false) {
    if (!el || shouldSkipReveal(el)) return;
    if (isComponent) el.classList.add('reveal--component');
    if (!el.classList.contains('reveal')) el.classList.add('reveal');
  }

  sections.forEach(section => {
    section.querySelectorAll(componentRevealSelector).forEach(el => addReveal(el, true));

    section.querySelectorAll(standaloneRevealSelector).forEach(el => {
      if (el.closest('.reveal--component')) return;
      if (
        el.closest('.pricing__panel') ||
        el.closest('.pricing__mini-card') ||
        el.classList.contains('pricing__panel') ||
        el.classList.contains('pricing__mini-card')
      ) return;
      addReveal(el);
    });
  });

  document.querySelectorAll('.reveal--component .reveal').forEach(el => {
    if (el.classList.contains('reveal--component')) return;
    el.classList.remove(
      'reveal',
      'reveal--visible',
      'reveal-delay-1',
      'reveal-delay-2',
      'reveal-delay-3',
      'reveal-delay-4'
    );
    el.classList.add('reveal__child-static');
  });

  // Stagger sibling component cards
  document.querySelectorAll(
    '.ecosystem__grid, .features__cards-wrapper'
  ).forEach(container => {
    const children = Array.from(container.children).filter(child => child.classList.contains('reveal--component'));
    children.forEach((child, i) => {
      if (i > 0) child.classList.add(`reveal-delay-${Math.min(i, 4)}`);
    });
  });

  // Collect all reveal elements
  const revealEls = document.querySelectorAll('.reveal');

  if (!isInIframe) {
    // === STANDALONE MODE: reveal once on first viewport entry ===
    const hidden = new Set(revealEls);
    let lastY = -1;

    function checkReveals() {
      if (!hidden.size) return;

      const y = window.scrollY;
      // Only check when scroll position changes
      if (y !== lastY) {
        lastY = y;
        const vh = window.innerHeight;

        // Check hidden → reveal (enter viewport from bottom with -30px margin)
        hidden.forEach(el => {
          const top = el.getBoundingClientRect().top;
          if (top < vh - 30) {
            el.classList.add('reveal--visible');
            hidden.delete(el);
          }
        });
      }
      requestAnimationFrame(checkReveals);
    }
    requestAnimationFrame(checkReveals);
  } else {
    // === IFRAME MODE: listen for parent scroll position via postMessage ===
    const pendingParentRevealEls = new Set(revealEls);
    const parentManagedPricingCards = isTouchDevice
      ? Array.from(document.querySelectorAll('.pricing__card'))
      : [];

    function checkRevealFromParent(parentScrollY, parentViewportH) {
      pendingParentRevealEls.forEach(el => {
        const rect = el.getBoundingClientRect(); // position relative to iframe viewport (= iframe document since no scroll)
        const elTop = rect.top;
        const elBottom = rect.bottom;

        // Element is "visible" if it overlaps with parent's visible window
        // parentScrollY = how far parent scrolled the iframe up
        // visible range in iframe coords: [parentScrollY, parentScrollY + parentViewportH]
        const visibleTop = parentScrollY;
        const visibleBottom = parentScrollY + parentViewportH - 20;

        if (!el.classList.contains('reveal--visible') && elTop < visibleBottom && elBottom > visibleTop) {
          el.classList.add('reveal--visible');
          pendingParentRevealEls.delete(el);
        }
      });

      // Also handle pricing cards on mobile
      if (parentManagedPricingCards.length) {
        const centerZoneTop = parentScrollY + parentViewportH * 0.3;
        const centerZoneBottom = parentScrollY + parentViewportH * 0.7;
        parentManagedPricingCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.top < centerZoneBottom && rect.bottom > centerZoneTop) {
            card.classList.add('pricing__card--active');
          } else {
            card.classList.remove('pricing__card--active');
          }
        });
      }
    }

    window.addEventListener('message', function(e) {
      if (!e.data || e.data.type !== 'NESSO_PARENT_SCROLL') return;
      if (e.data.mode && e.data.mode !== 'landing') return;
      checkRevealFromParent(e.data.scrollY, e.data.viewportH);
    });
  }
});
