<?php
// Run with a local PHP CLI. WordPress APIs and SMTP are mocked; production is never contacted.
ob_start();
define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );
$GLOBALS['test_store'] = array();
$GLOBALS['test_meta'] = array();
$GLOBALS['test_mail_ok'] = true;
$GLOBALS['test_published'] = true;
$GLOBALS['test_mails'] = array();
$GLOBALS['test_mail_exception'] = null;
$GLOBALS['test_receipt_exception'] = false;
$GLOBALS['test_template_exception'] = false;
$GLOBALS['test_hooks'] = array();
$GLOBALS['test_options'] = array();
$GLOBALS['test_can_edit'] = true;
$GLOBALS['test_nonce_ok'] = true;
$GLOBALS['test_view'] = 'thank-you';
$GLOBALS['test_rewrite_rules'] = array( '^nesso-retouch-thank-you/?$' => 'index.php?pagename=nesso-retouch&nesso_retouch_view=thank-you' );

class WP_Error {
    public $code;
    public $message;
    public $data;
    public function __construct( $code, $message = '', $data = array() ) { $this->code = $code; $this->message = $message; $this->data = $data; }
    public function get_error_message() { return $this->message; }
    public function get_error_data() { return $this->data; }
}
class WP_REST_Request {
    private $params;
    public function __construct( $params ) { $this->params = $params; }
    public function get_param( $key ) { return $this->params[$key] ?? ''; }
    public function get_file_params() { return array(); }
}
class TestRedirect extends Exception {}
class TestDenied extends Exception {}
function check( $condition, $message ) { if ( ! $condition ) throw new Exception( $message ); }
function add_action( $name, $callback ) { $GLOBALS['test_hooks'][$name][] = $callback; }
function remove_action( $name, $callback ) { $GLOBALS['test_hooks'][$name] = array_values( array_filter( $GLOBALS['test_hooks'][$name] ?? array(), function( $entry ) use ( $callback ) { return $entry !== $callback; } ) ); }
function add_filter() {}
function add_shortcode() {}
function home_url( $path = '' ) { return 'https://nesso.vn' . $path; }
function wp_parse_url( $url, $component = -1 ) { return parse_url( $url, $component ); }
function is_ssl() { return true; }
function get_page_by_path() {
    if ( $GLOBALS['test_receipt_exception'] ) throw new Error( 'Mock receipt lookup error' );
    return $GLOBALS['test_published'] ? (object) array( 'post_status' => 'publish' ) : null;
}
function wp_generate_password( $length ) { $GLOBALS['test_token'] = substr( bin2hex( random_bytes( $length ) ), 0, $length ); return $GLOBALS['test_token']; }
function set_transient( $key, $value, $ttl ) { $GLOBALS['test_store'][$key] = $value; return true; }
function get_transient( $key ) { return $GLOBALS['test_store'][$key] ?? false; }
function delete_transient( $key ) { $found = isset( $GLOBALS['test_store'][$key] ); unset( $GLOBALS['test_store'][$key] ); return $found; }
function get_post_meta( $id, $key, $single = true ) { return $GLOBALS['test_meta'][$id][$key] ?? ''; }
function update_post_meta( $id, $key, $value ) { $GLOBALS['test_meta'][$id][$key] = $value; }
function get_query_var( $key ) { return 'nesso_retouch_view' === $key ? $GLOBALS['test_view'] : ''; }
function nocache_headers() {}
function wp_unslash( $value ) { return $value; }
function wp_safe_redirect( $url, $status ) { throw new TestRedirect( $url, $status ); }
function sanitize_text_field( $v ) { return trim( strip_tags( $v ) ); }
function sanitize_textarea_field( $v ) { return trim( strip_tags( $v ) ); }
function sanitize_email( $v ) { return trim( $v ); }
function is_email( $v ) { return filter_var( $v, FILTER_VALIDATE_EMAIL ); }
function esc_url_raw( $v ) { return $v; }
function esc_url( $v ) { return htmlspecialchars( $v, ENT_QUOTES ); }
function esc_html( $v ) { return htmlspecialchars( $v, ENT_QUOTES ); }
function esc_attr( $v ) { return htmlspecialchars( $v, ENT_QUOTES ); }
function wp_json_encode( $v ) { return json_encode( $v ); }
function is_wp_error( $v ) { return $v instanceof WP_Error; }
function rest_ensure_response( $v ) { return $v; }
function current_time() { return '2026-10-12 10:00:00'; }
function wp_date( $format = '' ) {
    if ( $GLOBALS['test_template_exception'] && 0 === strpos( $format, 'M j' ) ) throw new TypeError( 'Mock template failure' );
    return 'Oct 12, 2026';
}
function mysql2date( $format, $value ) { check( '2026-10-12 10:00:00' === $value, 'Retry must retain original submission time' ); return wp_date( $format ); }
function wp_insert_post() { return 123; }
function absint( $v ) { return abs( (int) $v ); }
function get_post_type( $post ) { return 123 === (int) ( is_object( $post ) ? $post->ID : $post ) ? 'nesso_retouch_trial' : 'page'; }
function current_user_can() { return $GLOBALS['test_can_edit']; }
function check_admin_referer() { if ( ! $GLOBALS['test_nonce_ok'] ) throw new TestDenied( 'Invalid nonce', 403 ); }
function get_option( $key, $default = false ) {
    if ( 'rewrite_rules' === $key ) return $GLOBALS['test_rewrite_rules'];
    return $GLOBALS['test_options'][$key] ?? $default;
}
function add_option( $key, $value ) { if ( isset( $GLOBALS['test_options'][$key] ) ) return false; $GLOBALS['test_options'][$key] = $value; return true; }
function delete_option( $key ) { unset( $GLOBALS['test_options'][$key] ); }
function wp_die( $message, $title = '', $data = array() ) { throw new TestDenied( $message, $data['response'] ?? 500 ); }
function get_edit_post_link( $id ) { return 'https://nesso.vn/wp-admin/post.php?post=' . $id . '&action=edit'; }
function admin_url( $path ) { return 'https://nesso.vn/wp-admin/' . $path; }
function wp_nonce_field( $action ) { echo '<input name="_wpnonce" value="mock-' . esc_attr( $action ) . '">'; }
function wp_mail( $to, $subject, $body, $headers ) {
    $GLOBALS['test_mails'][] = compact( 'to', 'subject', 'body', 'headers' );
    if ( $GLOBALS['test_mail_exception'] ) throw $GLOBALS['test_mail_exception'];
    if ( ! $GLOBALS['test_mail_ok'] ) {
        foreach ( $GLOBALS['test_hooks']['wp_mail_failed'] ?? array() as $callback ) {
            $callback( new WP_Error( 'wp_mail_failed', 'Mock SMTP authentication failure', array( 'subject' => $subject ) ) );
        }
    }
    return $GLOBALS['test_mail_ok'];
}

$source = file_get_contents( __DIR__ . '/../WP/function-wp.php' );
$start = strpos( $source, "add_action( 'rest_api_init', 'nesso_photo_retouch_register_trial_route' )" );
$end = strpos( $source, '// functions.php', $start );
check( false !== $start && false !== $end, 'Cannot locate actual backend functions' );
eval( substr( $source, $start, $end - $start ) );

function expect_redirect() {
    try { nesso_photo_retouch_guard_thank_you(); }
    catch ( TestRedirect $redirect ) {
        check( 303 === $redirect->getCode(), 'Expected uncached 303' );
        check( home_url( '/nesso-retouch/' ) === $redirect->getMessage(), 'Unexpected redirect destination' );
        return;
    }
    throw new Exception( 'Expected receipt guard to redirect' );
}

$_COOKIE = array();
expect_redirect();
$_COOKIE['nesso_retouch_receipt'] = array( 'bad' );
expect_redirect();
$request = new WP_REST_Request( array( 'name' => 'Local QA', 'email' => 'qa@example.test', 'company' => 'QA Studio', 'tier' => 'Medium', 'submission_mode' => 'link', 'cloud_link' => 'https://example.test/folder' ) );
$response = nesso_photo_retouch_handle_trial( $request );
check( true === $response['ok'], 'Successful request was rejected' );
check( home_url( '/nesso-retouch-thank-you/' ) === $response['thank_you_url'], 'Missing thank-you URL' );
$mail = $GLOBALS['test_mails'][0];
check( 'contact@nesso.vn' === $mail['to'], 'Recipient changed' );
check( false !== strpos( $mail['subject'], 'Medium' ), 'Plan missing in email' );
check( false !== strpos( $mail['body'], 'https://example.test/folder' ), 'Cloud link missing in email' );
check( false !== strpos( $mail['body'], 'QA Studio' ), 'Company missing in email' );
check( false === strpos( $mail['body'], 'Phone' ), 'Phone row must not be in email' );
$_COOKIE['nesso_retouch_receipt'] = $GLOBALS['test_token'];
nesso_photo_retouch_guard_thank_you(); // A valid receipt renders the page (no redirect thrown).
check( false === nesso_photo_retouch_keep_thank_you_route( 'https://nesso.vn/nesso-retouch/' ), 'Canonical redirect must keep the thank-you URL' );
expect_redirect(); // The same cookie cannot render another conversion page.
$GLOBALS['test_view'] = '';
nesso_photo_retouch_guard_thank_you(); // Other pages are never gated.
check( 'https://nesso.vn/nesso-retouch/' === nesso_photo_retouch_keep_thank_you_route( 'https://nesso.vn/nesso-retouch/' ), 'Canonical redirect changed for other pages' );
$GLOBALS['test_view'] = 'thank-you';

$expired_url = nesso_photo_retouch_issue_thank_you( 123 );
$_COOKIE['nesso_retouch_receipt'] = $GLOBALS['test_token'];
$GLOBALS['test_store'] = array();
expect_redirect();

$GLOBALS['test_mail_ok'] = false;
$response = nesso_photo_retouch_handle_trial( $request );
check( $response instanceof WP_Error && 'nesso_photo_retouch_mail_failed' === $response->code, 'Mail failure must not return success/thank-you URL' );
check( 0 === count( $GLOBALS['test_store'] ), 'Mail failure issued a receipt' );
$GLOBALS['test_mail_ok'] = true;
$GLOBALS['test_published'] = false;
$response = nesso_photo_retouch_handle_trial( $request );
check( $response['ok'] && '' === $response['thank_you_url'], 'Unpublished landing page must fall back to modal' );
$GLOBALS['test_published'] = true;
$GLOBALS['test_rewrite_rules'] = array();
$response = nesso_photo_retouch_handle_trial( $request );
check( $response['ok'] && '' === $response['thank_you_url'], 'Missing rewrite rule must fall back to modal' );
$GLOBALS['test_rewrite_rules'] = array( '^nesso-retouch-thank-you/?$' => 'index.php?pagename=nesso-retouch&nesso_retouch_view=thank-you' );
$GLOBALS['test_published'] = false;
$before = count( $GLOBALS['test_mails'] );
$response = nesso_photo_retouch_handle_trial( new WP_REST_Request( array( 'website_url' => 'spam' ) ) );
check( ! isset( $response['thank_you_url'] ) && count( $GLOBALS['test_mails'] ) === $before, 'Honeypot must not issue a receipt or send mail' );
$response = nesso_photo_retouch_handle_trial( new WP_REST_Request( array( 'name' => 'Test', 'email' => 'invalid', 'company' => 'QA Studio' ) ) );
check( $response instanceof WP_Error, 'Invalid contact accepted' );
foreach ( array( 'someone@gmail.com', 'Someone@GMAIL.COM', 'someone@googlemail.com' ) as $personal ) {
    $response = nesso_photo_retouch_handle_trial( new WP_REST_Request( array( 'name' => 'Test', 'email' => $personal, 'company' => 'QA Studio' ) ) );
    check( $response instanceof WP_Error && 'nesso_photo_retouch_personal_email' === $response->code, 'Personal Gmail accepted: ' . $personal );
}
foreach ( array( '', '   ', str_repeat( 'x', 121 ) ) as $company ) {
    $response = nesso_photo_retouch_handle_trial( new WP_REST_Request( array( 'name' => 'Test', 'email' => 'qa@example.test', 'company' => $company ) ) );
    check( $response instanceof WP_Error && 'nesso_photo_retouch_invalid_company' === $response->code, 'Invalid company accepted' );
}
check( count( $GLOBALS['test_mails'] ) === $before, 'Rejected contact details must not send mail' );

// Native PHP Errors are not PHPMailer Exceptions. They previously escaped the endpoint.
$_SERVER['REMOTE_ADDR'] = '192.0.2.10';
$GLOBALS['test_store'] = array();
$GLOBALS['test_published'] = true;
$GLOBALS['test_mail_exception'] = new Error( 'Call to undefined function PHPMailer\\PHPMailer\\mail()' );
$before = count( $GLOBALS['test_mails'] );
$response = nesso_photo_retouch_handle_trial( $request );
check( $response instanceof WP_Error, 'Thrown mail error escaped or became success' );
check( 'error' === get_post_meta( 123, '_nesso_photo_retouch_mail_status' ), 'Thrown mail error left pending status' );
check( 'send_email' === get_post_meta( 123, '_nesso_photo_retouch_mail_stage' ), 'Missing mail failure stage' );
check( false !== strpos( get_post_meta( 123, '_nesso_photo_retouch_mail_error' ), 'undefined function' ), 'Admin lost native error details' );
check( false === strpos( $response->message, 'undefined function' ), 'Public API leaked error internals' );
check( 123 === $response->data['request_id'], 'Missing saved request reference' );
check( $before + 1 === count( $GLOBALS['test_mails'] ), 'Email must never be automatically retried' );
check( false === get_transient( 'nesso_photo_retouch_trial_' . md5( $_SERVER['REMOTE_ADDR'] ) ), 'Failed mail kept rate limit' );
check( 1 === count( $GLOBALS['test_hooks']['wp_mail_failed'] ), 'Temporary mail hook leaked' );
$GLOBALS['test_mail_exception'] = null;

$GLOBALS['test_template_exception'] = true;
$before = count( $GLOBALS['test_mails'] );
$response = nesso_photo_retouch_handle_trial( $request );
check( $response instanceof WP_Error && 'prepare_email' === get_post_meta( 123, '_nesso_photo_retouch_mail_stage' ), 'Template error was not contained' );
check( count( $GLOBALS['test_mails'] ) === $before, 'Broken template attempted email' );
$GLOBALS['test_template_exception'] = false;

$GLOBALS['test_mail_ok'] = false;
$response = nesso_photo_retouch_handle_trial( $request );
check( 'failed' === get_post_meta( 123, '_nesso_photo_retouch_mail_status' ), 'False mail result must be failed' );
check( 'Mock SMTP authentication failure' === get_post_meta( 123, '_nesso_photo_retouch_mail_error' ), 'SMTP detail missing in admin' );
$GLOBALS['test_mail_ok'] = true;
$GLOBALS['test_receipt_exception'] = true;
$response = nesso_photo_retouch_handle_trial( $request );
check( $response['ok'] && '' === $response['thank_you_url'], 'Receipt failure must preserve successful mail and modal fallback' );
check( 'sent' === get_post_meta( 123, '_nesso_photo_retouch_mail_status' ), 'Receipt error changed mail status' );
check( '' === get_post_meta( 123, '_nesso_photo_retouch_mail_error' ), 'Success must clear previous mail error' );
$GLOBALS['test_receipt_exception'] = false;

// Admin retry uses the existing record/links, never reuploads and never issues an Ads receipt.
update_post_meta( 123, '_nesso_photo_retouch_mail_status', 'error' );
update_post_meta( 123, '_nesso_photo_retouch_files', json_encode( array( array( 'name' => 'Original.CR3', 'url' => 'https://nesso.vn/saved/Original.CR3', 'size' => 214912813 ) ) ) );
$_POST = array( 'request_id' => 123 );
$_SERVER['REQUEST_METHOD'] = 'POST';
$GLOBALS['test_store'] = array();
function retry_mail() {
    try { nesso_photo_retouch_retry_mail(); }
    catch ( TestRedirect $redirect ) {
        check( get_edit_post_link( 123 ) === $redirect->getMessage(), 'Retry must return to saved request admin' );
        return;
    }
    throw new Exception( 'Retry did not return to admin' );
}
$before = count( $GLOBALS['test_mails'] );
retry_mail();
check( 'sent' === get_post_meta( 123, '_nesso_photo_retouch_mail_status' ), 'Saved retry failed' );
check( false !== strpos( $GLOBALS['test_mails'][$before]['body'], 'https://nesso.vn/saved/Original.CR3' ), 'Retry lost saved image URL' );
check( 0 === count( $GLOBALS['test_store'] ), 'Admin retry issued a conversion receipt' );
check( empty( $GLOBALS['test_options'] ), 'Retry left its lock behind' );
retry_mail();
check( $before + 1 === count( $GLOBALS['test_mails'] ), 'Sent email was resent by duplicate admin POST' );
foreach ( array( 'permission', 'nonce', 'method', 'post_type', 'lock' ) as $case ) {
    $GLOBALS['test_can_edit'] = 'permission' !== $case;
    $GLOBALS['test_nonce_ok'] = 'nonce' !== $case;
    $_SERVER['REQUEST_METHOD'] = 'method' === $case ? 'GET' : 'POST';
    $_POST['request_id'] = 'post_type' === $case ? 456 : 123;
    if ( 'lock' === $case ) $GLOBALS['test_options']['nesso_retouch_mail_retry_123'] = time();
    try { nesso_photo_retouch_retry_mail(); throw new Exception( 'Retry accepted invalid ' . $case ); }
    catch ( TestDenied $denied ) { check( in_array( $denied->getCode(), array( 403, 409 ), true ), 'Unexpected permission response' ); }
    $GLOBALS['test_options'] = array();
}
$GLOBALS['test_can_edit'] = true;
$GLOBALS['test_nonce_ok'] = true;
$post = (object) array( 'ID' => 123 );
update_post_meta( 123, '_nesso_photo_retouch_mail_status', 'error' );
update_post_meta( 123, '_nesso_photo_retouch_mail_error', '<script>private error</script>' );
ob_start();
nesso_photo_retouch_render_submission_meta_box( $post );
$admin_markup = ob_get_clean();
check( false !== strpos( $admin_markup, 'Mail error' ) && false !== strpos( $admin_markup, 'form="nesso-retouch-retry-mail"' ), 'Admin error/retry controls missing' );
check( false === strpos( $admin_markup, '<script>private error' ), 'Admin diagnostics must be escaped' );
ob_start();
nesso_photo_retouch_retry_mail_form();
$retry_form = ob_get_clean();
check( false !== strpos( $retry_form, 'method="post"' ) && false !== strpos( $retry_form, '_wpnonce' ), 'Retry form must have POST + nonce' );
ob_end_clean();
if ( in_array( '--render-admin', $argv, true ) ) {
    echo '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retouch mail recovery test</title></head><body><form id="post" action="/editor-save" method="post"><input name="editor_only" value="must-not-submit">' . $admin_markup . '</form>' . $retry_form . '</body></html>';
    exit;
}
echo "PASS: handler + thank-you route/receipt gate + mail recovery: success, route fallback, canonical, false/throw/template errors, private diagnostics, receipt isolation, saved-file retry, nonce/capability/lock checks, no duplicate send/conversion. No real mail sent.\n";
