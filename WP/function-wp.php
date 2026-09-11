<?php
/**
 * Theme functions and definitions.
 *
 * For additional information on potential customization options,
 * read the developers' documentation:
 *
 * https://developers.elementor.com/docs/hello-elementor-theme/
 *
 * @package HelloElementorChild
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_CHILD_VERSION', '2.0.4' );

/**
 * Load child theme scripts & styles.
 *
 * @return void
 */
function hello_elementor_child_scripts_styles() {

	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		[
			'hello-elementor-theme-style',
		],
		3.9,
	);

}
add_action( 'wp_enqueue_scripts', 'hello_elementor_child_scripts_styles', 20 );


require_once get_stylesheet_directory() . '/function/swiper-carousel.php';

// Enqueue GSAP and ScrollTrigger


function theme_enqueue_gsap_scroll() {

    if ( is_page(4351) ) {
        return;
    }

    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        array(),
        null,
        true
    );

    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        array('gsap'),
        null,
        true
    );
}


add_action('wp_enqueue_scripts', 'theme_enqueue_gsap_scroll');




// Enqueue Preloader JS (chỉ trang chủ)

add_action('wp_enqueue_scripts', 'child_theme_loading_scripts', 15);

function child_theme_loading_scripts() {
     if ( is_page(4351) ) {
        return;
    }

        // JS
//         wp_enqueue_script(
//             'loading-fade',
//             get_stylesheet_directory_uri() . '/js/loading-fade.min.js',
//             array(),           
//             '1.5.8',                  
//             true            
//         );

    
     if ( is_front_page() ) {
        wp_enqueue_script('swiper-custom', get_stylesheet_directory_uri() . '/js/swiper-home.js', array('swiper-js'), '1.9', true);

    }
  
     if ( is_home() ||  is_front_page() || is_page(44) ||  is_post_type_archive( 'portfolio' ) || is_tax( 'portfolio-category' ) || is_category() ) {
        wp_enqueue_style('swiper-css', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css', array(), null);
        wp_enqueue_script('swiper-js', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), null, true);

    }

    if ( is_page(44) ) {
        wp_add_inline_script(
            'swiper-js',
            "
            (function () {
                function normalizeNessoServicesCarousel() {
                    document.querySelectorAll('.service-section .nesso-services-carousel').forEach(function (carousel) {
                        var serviceSection = carousel.closest('.service-section');

                        if (!serviceSection || !serviceSection.parentNode) {
                            return;
                        }

                        serviceSection.parentNode.insertBefore(carousel, serviceSection);
                        serviceSection.remove();
                    });
                }

                function initNessoServicesCarousel() {
                    normalizeNessoServicesCarousel();

                    document.querySelectorAll('.nesso-services-carousel').forEach(function (carousel) {
                        if (carousel.dataset.sliderReady === 'true') {
                            return;
                        }

                        var track = carousel.querySelector('.nesso-services-carousel__track');
                        var slides = track ? Array.prototype.slice.call(track.querySelectorAll('.nesso-services-carousel__slide')) : [];
                        var totalSlides = slides.length;

                        if (!track || !totalSlides) {
                            return;
                        }

                        var counter = carousel.querySelector('.nesso-services-carousel__counter');
                        var prevBtn = carousel.querySelector('.nesso-services-carousel__arrow--prev');
                        var nextBtn = carousel.querySelector('.nesso-services-carousel__arrow--next');
                        var currentIndex = 0;

                        track.style.display = 'block';
                        track.style.transform = 'none';
                        track.style.transition = 'none';
                        track.style.willChange = 'auto';

                        function prepareElementorSlide(slide) {
                            slide.querySelectorAll('.e-con.e-parent:not(.e-lazyloaded)').forEach(function (container) {
                                container.classList.add('e-lazyloaded');
                            });
                        }

                        function updateCounter() {
                            if (!counter) {
                                return;
                            }

                            counter.textContent = '(Set ' + (currentIndex + 1) + '/' + totalSlides + ')';
                        }

                        function renderSlide() {
                            slides.forEach(function (slide, index) {
                                var isActive = index === currentIndex;

                                if (isActive) {
                                    prepareElementorSlide(slide);
                                }

                                slide.style.display = isActive ? 'block' : 'none';
                                slide.style.width = '100%';
                                slide.style.minWidth = '0';
                                slide.style.flex = 'none';
                                slide.style.opacity = isActive ? '1' : '0';
                                slide.style.transform = 'none';
                                slide.style.transition = 'none';
                                slide.style.pointerEvents = isActive ? 'auto' : 'none';
                                slide.classList.toggle('is-active', isActive);
                                slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
                            });

                            updateCounter();
                        }

                        function goToSlide(direction) {
                            if (totalSlides < 2) {
                                return;
                            }

                            currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
                            renderSlide();
                        }

                        function stopPointerBubble(event) {
                            event.stopPropagation();
                        }

                        function handleControlClick(event, direction) {
                            event.preventDefault();
                            event.stopPropagation();

                            if (direction === 'prev') {
                                goToSlide(-1);
                            } else {
                                goToSlide(1);
                            }
                        }

                        if (prevBtn) {
                            prevBtn.addEventListener('pointerdown', stopPointerBubble, true);
                            prevBtn.addEventListener('click', function (event) {
                                handleControlClick(event, 'prev');
                            }, true);
                        }

                        if (nextBtn) {
                            nextBtn.addEventListener('pointerdown', stopPointerBubble, true);
                            nextBtn.addEventListener('click', function (event) {
                                handleControlClick(event, 'next');
                            }, true);
                        }

                        slides.forEach(prepareElementorSlide);
                        renderSlide();
                        carousel.dataset.sliderReady = 'true';
                    });
                }

                document.addEventListener('DOMContentLoaded', initNessoServicesCarousel);
                window.addEventListener('load', initNessoServicesCarousel);
            })();
            "
        );
    }

    if ( is_home() || is_category() ) {

        wp_enqueue_script(
            'trending-articles',
            get_stylesheet_directory_uri() . '/js/trending-articles.js',
            array( 'swiper-js' ), '1.0.1', true
        );
    }
   
	 wp_enqueue_script(
            'site',
            get_stylesheet_directory_uri() . '/js/site.min.js',
            array(),           
            '0.1.3.6',                  
            true            
    );
     wp_enqueue_script(
            'scrool-header',
            get_stylesheet_directory_uri() . '/js/scroll-header.js',
            array(),           
            '0.1.0',                  
            true            
    );

	
}


// Thêm HTML Preloader vào body (chỉ trang chủ)
// Main Home service carousel shortcode.
function nesso_services_carousel_shortcode() {
    $template_ids = array(1063, 1135, 1148);

    ob_start();
    ?>
    <section class="nesso-services-carousel" aria-label="Nesso services carousel">
        <div class="nesso-services-carousel__controls" aria-label="Service carousel navigation">
            <span class="nesso-services-carousel__counter" aria-live="polite">(Set 1/3)</span>
            <button class="nesso-services-carousel__arrow nesso-services-carousel__arrow--prev" type="button" aria-label="Previous service">
                <img src="https://nesso.vn/wp-content/uploads/2026/07/Frame-268.png" alt="" loading="lazy" decoding="async">
            </button>
            <button class="nesso-services-carousel__arrow nesso-services-carousel__arrow--next" type="button" aria-label="Next service">
                <img src="https://nesso.vn/wp-content/uploads/2026/07/Frame-267.png" alt="" loading="lazy" decoding="async">
            </button>
        </div>
        <div class="nesso-services-carousel__viewport">
            <div class="nesso-services-carousel__track">
                <?php foreach ( $template_ids as $template_id ) : ?>
                    <div class="nesso-services-carousel__slide">
                        <?php echo do_shortcode( sprintf( '[hfe_template id="%d"]', $template_id ) ); ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
    <?php

    return ob_get_clean();
}
add_shortcode( 'nesso_services_carousel', 'nesso_services_carousel_shortcode' );


function preloader_html() {
    // if (!is_front_page()) return;
    
    $logo = wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full');
    ?>

<!-- <div class="loading-overlay" id="loadingOverlay">
    <img src="<?php echo get_stylesheet_directory_uri(); ?>/images/nesso-logo.svg" alt="Loading..."
        class="loading-logo">
</div> -->

<?php
}
add_action('wp_body_open', 'preloader_html', 1);



add_action('wp_footer', 'them_nav_template');
function them_nav_template() {
    if (is_front_page() ) {
        ?>
<template id="navTemplate">
    <div class="nav-group">
        <span class="set-label"></span>
        <button class="nav-btn btn-prev" aria-label="Previous">
            <i data-feather="chevron-left"></i>
        </button>
        <button class="nav-btn btn-next" aria-label="Next">
            <i data-feather="chevron-right"></i>
        </button>
    </div>
</template>
<?php
    }
}


function them_feather_icons() {
    // Đăng ký và gọi script Feather Icons từ CDN
    wp_enqueue_script( 'feather-icons', 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js', array(), '4.29.0', true );
}
add_action( 'wp_enqueue_scripts', 'them_feather_icons' );


add_action( 'wp_footer', function() {
    if ( ! is_singular( 'portfolio' ) ) return;
    ?>
<div id="related-portfolio-wrapper" style="display:none">
    <?php get_template_part( 'template-parts/related-portfolio' ); ?>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
    var related = document.getElementById('related-portfolio-wrapper');
    var footer = document.querySelector('.elementor-location-footer') ||
        document.querySelector('footer');
    if (related && footer) {
        footer.parentNode.insertBefore(related, footer);
        related.style.display = 'block';
    }
});
</script>
<?php
}, 5 );


add_filter( 'query_vars', 'add_paged_query_var' );
function add_paged_query_var( $vars ) {
    $vars[] = 'paged';
    $vars[] = 'nesso_lms_view';
    $vars[] = 'nesso_lms_blog_slug';
    $vars[] = 'nesso_lms_blog_sitemap';
    return $vars;
}

add_action('init', 'nesso_lms_proposal_rewrite');
function nesso_lms_proposal_rewrite() {
    add_rewrite_rule(
        '^lms-e-learning-page/lms-blog-sitemap\.xml$',
        'index.php?nesso_lms_blog_sitemap=1',
        'top'
    );

    add_rewrite_rule(
        '^nesso-lms-blog-sitemap\.xml$',
        'index.php?nesso_lms_blog_sitemap=1',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/proposal/?$',
        'index.php?page_id=4351&nesso_lms_view=proposal',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/lms-blog/([^/]+)/?$',
        'index.php?page_id=4351&nesso_lms_view=blog&nesso_lms_blog_slug=$matches[1]',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/lms-blog/?$',
        'index.php?page_id=4351&nesso_lms_view=blog',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/contact/?$',
        'index.php?page_id=4351&nesso_lms_view=contact',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/lms-features/?$',
        'index.php?page_id=4351&nesso_lms_view=features',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/482917306584/([^/]+)/?$',
        'index.php?page_id=4351&nesso_lms_view=lucky',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/482917306584/?$',
        'index.php?page_id=4351&nesso_lms_view=lucky',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/9184726503918274/?$',
        'index.php?page_id=4351&nesso_lms_view=image',
        'top'
    );

    add_rewrite_rule(
        '^lms-e-learning-page/6402819573064918/?$',
        'index.php?page_id=4351&nesso_lms_view=image',
        'top'
    );

    if ( get_option('nesso_lms_proposal_rewrite_version') !== '10' ) {
        flush_rewrite_rules(false);
        update_option('nesso_lms_proposal_rewrite_version', '10');
    }
}

add_filter('redirect_canonical', 'nesso_lms_keep_proposal_route', 10, 2);
function nesso_lms_keep_proposal_route($redirect_url, $requested_url) {
    $request_path = isset($_SERVER['REQUEST_URI']) ? wp_parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '';

    if ( preg_match('#/lms-e-learning-page/(proposal|lms-blog|contact|lms-features|482917306584|9184726503918274|6402819573064918)(?:/[^/]+)?/?$#', $request_path) ) {
        return false;
    }

    return $redirect_url;
}

add_action( 'template_redirect', 'nesso_lms_redirect_blog_route_trailing_slash', 1 );
function nesso_lms_redirect_blog_route_trailing_slash() {
    if ( is_admin() || wp_doing_ajax() ) {
        return;
    }

    $request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
    $request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

    if ( ! $request_path || ! preg_match( '#^/lms-e-learning-page/lms-blog(?:/[^/]+)?$#', $request_path ) ) {
        return;
    }

    $query  = wp_parse_url( $request_uri, PHP_URL_QUERY );
    $target = home_url( trailingslashit( ltrim( $request_path, '/' ) ) );

    if ( $query ) {
        $target .= '?' . $query;
    }

    wp_safe_redirect( $target, 301 );
    exit;
}

function nesso_lms_get_blog_route_slug() {
    $slug = get_query_var( 'nesso_lms_blog_slug' );

    if ( empty( $slug ) && isset( $_SERVER['REQUEST_URI'] ) ) {
        $request_path = wp_parse_url( wp_unslash( $_SERVER['REQUEST_URI'] ), PHP_URL_PATH );

        if ( preg_match( '#/lms-e-learning-page/lms-blog/([^/]+)/?$#', $request_path, $matches ) ) {
            $slug = rawurldecode( $matches[1] );
        }
    }

    return $slug ? sanitize_title( $slug ) : '';
}

function nesso_lms_get_blog_route_post() {
    static $blog_post = null;
    static $loaded = false;

    if ( $loaded ) {
        return $blog_post;
    }

    $loaded = true;
    $slug = nesso_lms_get_blog_route_slug();

    if ( ! $slug ) {
        return null;
    }

    $posts = get_posts( array(
        'name'           => $slug,
        'post_type'      => 'lms_post',
        'post_status'    => 'publish',
        'numberposts'    => 1,
        'no_found_rows'  => true,
        'fields'         => 'all',
    ) );

    $blog_post = ! empty( $posts ) ? $posts[0] : null;

    return $blog_post;
}

function nesso_lms_get_blog_route_url( $post = null ) {
    if ( $post instanceof WP_Post ) {
        $slug = $post->post_name;
    } elseif ( is_object( $post ) && ! empty( $post->post_name ) ) {
        $slug = $post->post_name;
    } elseif ( is_array( $post ) && ! empty( $post['post_name'] ) ) {
        $slug = $post['post_name'];
    } else {
        $slug = nesso_lms_get_blog_route_slug();
    }

    if ( ! $slug ) {
        return home_url( '/lms-e-learning-page/lms-blog/' );
    }

    return home_url( '/lms-e-learning-page/lms-blog/' . $slug . '/' );
}

function nesso_lms_is_lms_post_sitemap_object( $object ) {
    return is_object( $object )
        && isset( $object->post_type )
        && 'lms_post' === $object->post_type
        && ! empty( $object->post_name );
}

function nesso_lms_get_blog_route_plain_text( $post, $limit = 0 ) {
    if ( ! $post instanceof WP_Post ) {
        return '';
    }

    $raw = has_excerpt( $post ) ? $post->post_excerpt : $post->post_content;
    $text = wp_strip_all_tags( strip_shortcodes( $raw ), true );
    $text = trim( preg_replace( '/\s+/u', ' ', $text ) );

    if ( $limit > 0 && function_exists( 'mb_strlen' ) && mb_strlen( $text, 'UTF-8' ) > $limit ) {
        return mb_substr( $text, 0, $limit - 3, 'UTF-8' ) . '...';
    }

    if ( $limit > 0 && strlen( $text ) > $limit ) {
        return substr( $text, 0, $limit - 3 ) . '...';
    }

    return $text;
}

function nesso_lms_get_blog_route_description( $post ) {
    $description = nesso_lms_get_blog_route_plain_text( $post, 180 );

    return $description ? $description : 'Bài viết chuyên sâu về LMS, thiết kế trải nghiệm học tập và chuyển đổi đào tạo từ Nesso.';
}

function nesso_lms_get_blog_route_image( $post ) {
    if ( ! $post instanceof WP_Post ) {
        return '';
    }

    $image_id = get_post_thumbnail_id( $post );

    if ( $image_id ) {
        $image = wp_get_attachment_image_url( $image_id, 'large' );

        if ( $image ) {
            return $image;
        }
    }

    return 'https://nesso.vn/wp-content/uploads/2026/06/logo-nesso.svg';
}

function nesso_lms_get_blog_route_title( $post ) {
    if ( ! $post instanceof WP_Post ) {
        return 'Bài viết LMS - Nesso';
    }

    return wp_strip_all_tags( get_the_title( $post ) ) . ' - Nesso LMS';
}

function nesso_lms_get_blog_sitemap_url() {
    return home_url( '/lms-e-learning-page/lms-blog-sitemap.xml' );
}

function nesso_lms_get_blog_route_schema_data( $post ) {
    $url = nesso_lms_get_blog_route_url( $post );
    $image = nesso_lms_get_blog_route_image( $post );

    return array(
        '@type'            => 'BlogPosting',
        '@id'              => $url . '#article',
        'mainEntityOfPage' => array(
            '@type' => 'WebPage',
            '@id'   => $url,
        ),
        'headline'         => wp_strip_all_tags( get_the_title( $post ) ),
        'description'      => nesso_lms_get_blog_route_description( $post ),
        'articleBody'      => nesso_lms_get_blog_route_plain_text( $post, 5000 ),
        'datePublished'    => get_the_date( DATE_W3C, $post ),
        'dateModified'     => get_the_modified_date( DATE_W3C, $post ),
        'author'           => array(
            '@type' => 'Organization',
            'name'  => 'Nesso',
            'url'   => home_url( '/' ),
        ),
        'publisher'        => array(
            '@type' => 'Organization',
            'name'  => 'Nesso',
            'logo'  => array(
                '@type' => 'ImageObject',
                'url'   => 'https://nesso.vn/wp-content/uploads/2026/02/Frame-24-1.svg',
            ),
        ),
        'image'            => $image ? array( $image ) : array(),
        'url'              => $url,
        'inLanguage'       => 'vi-VN',
    );
}

add_filter( 'pre_get_document_title', 'nesso_lms_blog_route_document_title', 30 );
function nesso_lms_blog_route_document_title( $title ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_title( $blog_post ) : $title;
}

add_filter( 'document_title_parts', 'nesso_lms_blog_route_document_title_parts', 30 );
function nesso_lms_blog_route_document_title_parts( $parts ) {
    $blog_post = nesso_lms_get_blog_route_post();

    if ( $blog_post ) {
        $parts['title'] = wp_strip_all_tags( get_the_title( $blog_post ) );
        $parts['site'] = 'Nesso LMS';
    }

    return $parts;
}

add_filter( 'get_canonical_url', 'nesso_lms_blog_route_core_canonical', 30, 2 );
function nesso_lms_blog_route_core_canonical( $canonical_url, $post ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_url( $blog_post ) : $canonical_url;
}

add_filter( 'rank_math/frontend/title', 'nesso_lms_blog_route_rank_math_title', 30 );
function nesso_lms_blog_route_rank_math_title( $title ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_title( $blog_post ) : $title;
}

add_filter( 'rank_math/frontend/description', 'nesso_lms_blog_route_rank_math_description', 30 );
function nesso_lms_blog_route_rank_math_description( $description ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_description( $blog_post ) : $description;
}

add_filter( 'rank_math/frontend/canonical', 'nesso_lms_blog_route_rank_math_canonical', 30 );
function nesso_lms_blog_route_rank_math_canonical( $canonical ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_url( $blog_post ) : $canonical;
}

add_filter( 'rank_math/opengraph/facebook/title', 'nesso_lms_blog_route_rank_math_title', 30 );
add_filter( 'rank_math/opengraph/facebook/description', 'nesso_lms_blog_route_rank_math_description', 30 );
add_filter( 'rank_math/opengraph/facebook/url', 'nesso_lms_blog_route_rank_math_canonical', 30 );
add_filter( 'rank_math/opengraph/twitter/title', 'nesso_lms_blog_route_rank_math_title', 30 );
add_filter( 'rank_math/opengraph/twitter/description', 'nesso_lms_blog_route_rank_math_description', 30 );

add_filter( 'rank_math/opengraph/facebook/image', 'nesso_lms_blog_route_rank_math_image', 30 );
add_filter( 'rank_math/opengraph/twitter/image', 'nesso_lms_blog_route_rank_math_image', 30 );
function nesso_lms_blog_route_rank_math_image( $image ) {
    $blog_post = nesso_lms_get_blog_route_post();

    return $blog_post ? nesso_lms_get_blog_route_image( $blog_post ) : $image;
}

add_filter( 'rank_math/frontend/robots', 'nesso_lms_blog_route_rank_math_robots', 30 );
function nesso_lms_blog_route_rank_math_robots( $robots ) {
    if ( nesso_lms_get_blog_route_post() && is_array( $robots ) ) {
        unset( $robots['noindex'] );
        $robots['index'] = 'index';
        $robots['follow'] = 'follow';
        $robots['max-image-preview'] = 'large';
    }

    return $robots;
}

add_filter( 'rank_math/json_ld', 'nesso_lms_blog_route_rank_math_json_ld', 99, 2 );
function nesso_lms_blog_route_rank_math_json_ld( $data, $jsonld ) {
    $blog_post = nesso_lms_get_blog_route_post();

    if ( ! $blog_post || ! is_array( $data ) ) {
        return $data;
    }

    $url = nesso_lms_get_blog_route_url( $blog_post );
    $title = nesso_lms_get_blog_route_title( $blog_post );
    $description = nesso_lms_get_blog_route_description( $blog_post );
    $image = nesso_lms_get_blog_route_image( $blog_post );

    foreach ( $data as $key => $entity ) {
        if ( ! is_array( $entity ) || empty( $entity['@type'] ) ) {
            continue;
        }

        $types = (array) $entity['@type'];

        if ( in_array( 'WebPage', $types, true ) ) {
            $data[ $key ]['@id'] = $url . '#webpage';
            $data[ $key ]['url'] = $url;
            $data[ $key ]['name'] = $title;
            $data[ $key ]['description'] = $description;
            $data[ $key ]['inLanguage'] = 'vi-VN';

            if ( $image ) {
                $data[ $key ]['primaryImageOfPage'] = array(
                    '@type' => 'ImageObject',
                    'url'   => $image,
                );
            }
        }

        if ( in_array( 'Article', $types, true ) || in_array( 'BlogPosting', $types, true ) ) {
            unset( $data[ $key ] );
        }
    }

    $data['NessoLmsBlogPosting'] = nesso_lms_get_blog_route_schema_data( $blog_post );

    return $data;
}

add_filter( 'wp_robots', 'nesso_lms_blog_route_robots', 30 );
function nesso_lms_blog_route_robots( $robots ) {
    if ( nesso_lms_get_blog_route_post() ) {
        unset( $robots['noindex'] );
        $robots['index'] = true;
        $robots['follow'] = true;
        $robots['max-image-preview'] = 'large';
    }

    return $robots;
}

add_action( 'wp_head', 'nesso_lms_blog_route_schema', 8 );
function nesso_lms_blog_route_schema() {
    $blog_post = nesso_lms_get_blog_route_post();

    if ( ! $blog_post || defined( 'RANK_MATH_VERSION' ) ) {
        return;
    }

    $schema = nesso_lms_get_blog_route_schema_data( $blog_post );
    $schema['@context'] = 'https://schema.org';

    echo "\n<script type=\"application/ld+json\" class=\"nesso-lms-blog-schema\">" . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . "</script>\n";
}

add_action( 'wp_head', 'nesso_lms_blog_route_crawlable_article_style', 9 );
function nesso_lms_blog_route_crawlable_article_style() {
    if ( ! nesso_lms_get_blog_route_post() ) {
        return;
    }
    ?>
    <style id="nesso-lms-blog-seo-article-style">
        .nesso-lms-seo-article {
            position: absolute !important;
            left: -10000px !important;
            top: auto !important;
            width: 1px !important;
            height: 1px !important;
            overflow: hidden !important;
        }
    </style>
    <?php
}

add_action( 'wp_footer', 'nesso_lms_blog_route_crawlable_article', 1 );
function nesso_lms_blog_route_crawlable_article() {
    $blog_post = nesso_lms_get_blog_route_post();

    if ( ! $blog_post ) {
        return;
    }

    $content = apply_filters( 'the_content', $blog_post->post_content );
    ?>
    <article class="nesso-lms-seo-article" aria-label="<?php echo esc_attr( get_the_title( $blog_post ) ); ?>">
        <h1><?php echo esc_html( get_the_title( $blog_post ) ); ?></h1>
        <?php echo wp_kses_post( $content ); ?>
    </article>
    <?php
}

add_action( 'template_redirect', 'nesso_lms_redirect_native_lms_post' );
function nesso_lms_redirect_native_lms_post() {
    if ( is_admin() || is_preview() || ! is_singular( 'lms_post' ) ) {
        return;
    }

    $blog_post = get_queried_object();

    if ( $blog_post instanceof WP_Post ) {
        wp_safe_redirect( nesso_lms_get_blog_route_url( $blog_post ), 301 );
        exit;
    }
}

add_action( 'template_redirect', 'nesso_lms_render_blog_sitemap', 0 );
function nesso_lms_render_blog_sitemap() {
    if ( '1' !== (string) get_query_var( 'nesso_lms_blog_sitemap' ) ) {
        return;
    }

    $posts = get_posts( array(
        'post_type'      => 'lms_post',
        'post_status'    => 'publish',
        'posts_per_page' => 500,
        'orderby'        => 'modified',
        'order'          => 'DESC',
        'no_found_rows'  => true,
    ) );

    status_header( 200 );
    header_remove( 'Cache-Control' );
    header_remove( 'Pragma' );
    header_remove( 'Expires' );
    header( 'Content-Type: application/xml; charset=UTF-8', true );
    header( 'Cache-Control: public, max-age=3600, s-maxage=3600', true );
    header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + HOUR_IN_SECONDS ) . ' GMT', true );

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    foreach ( $posts as $post ) {
        echo "\t<url>\n";
        echo "\t\t<loc>" . esc_url( nesso_lms_get_blog_route_url( $post ) ) . "</loc>\n";
        echo "\t\t<lastmod>" . esc_html( get_the_modified_date( DATE_W3C, $post ) ) . "</lastmod>\n";
        echo "\t\t<changefreq>weekly</changefreq>\n";
        echo "\t\t<priority>0.8</priority>\n";
        echo "\t</url>\n";
    }

    echo '</urlset>';
    exit;
}

add_filter( 'wp_sitemaps_posts_entry', 'nesso_lms_blog_route_core_sitemap_url', 30, 3 );
function nesso_lms_blog_route_core_sitemap_url( $entry, $post, $post_type ) {
    if ( 'lms_post' === $post_type && $post instanceof WP_Post ) {
        $entry['loc'] = nesso_lms_get_blog_route_url( $post );
    }

    return $entry;
}

add_filter( 'rank_math/sitemap/enable_caching', '__return_false', 99 );

add_filter( 'rank_math/sitemap/entry', 'nesso_lms_blog_route_rank_math_sitemap_url', 30, 3 );
function nesso_lms_blog_route_rank_math_sitemap_url( $url, $type, $object ) {
    if ( 'post' === $type && nesso_lms_is_lms_post_sitemap_object( $object ) ) {
        $url['loc'] = nesso_lms_get_blog_route_url( $object );
    }

    return $url;
}

add_filter( 'rank_math/sitemap/xml_post_url', 'nesso_lms_blog_route_rank_math_xml_post_url', 30, 2 );
function nesso_lms_blog_route_rank_math_xml_post_url( $url, $post ) {
    if ( nesso_lms_is_lms_post_sitemap_object( $post ) ) {
        return nesso_lms_get_blog_route_url( $post );
    }

    return $url;
}

add_filter( 'rank_math/sitemap/index', 'nesso_lms_blog_route_rank_math_sitemap_index', 30 );
function nesso_lms_blog_route_rank_math_sitemap_index( $xml ) {
    $xml .= "\n\t<sitemap>\n";
    $xml .= "\t\t<loc>" . esc_url( nesso_lms_get_blog_sitemap_url() ) . "</loc>\n";
    $xml .= "\t\t<lastmod>" . esc_html( gmdate( DATE_W3C ) ) . "</lastmod>\n";
    $xml .= "\t</sitemap>\n";

    return $xml;
}

add_filter( 'robots_txt', 'nesso_lms_blog_route_robots_sitemap', 30, 2 );
function nesso_lms_blog_route_robots_sitemap( $output, $public ) {
    $sitemap_line = 'Sitemap: ' . nesso_lms_get_blog_sitemap_url();

    if ( false === strpos( $output, $sitemap_line ) ) {
        $output = rtrim( $output ) . "\n" . $sitemap_line . "\n";
    }

    return $output;
}

function nesso_lms_blog_translation_taxonomies() {
    return array( 'lms_category', 'lms_categories', 'lms-categories' );
}

add_action( 'add_meta_boxes', 'nesso_lms_blog_translation_meta_boxes' );
function nesso_lms_blog_translation_meta_boxes() {
    add_meta_box(
        'nesso_lms_blog_translation_en',
        'Nội dung tiếng Anh cho LMS Blog',
        'nesso_lms_blog_translation_meta_box',
        'lms_post',
        'normal',
        'default'
    );
}

function nesso_lms_blog_translation_meta_box( $post ) {
    wp_nonce_field( 'nesso_lms_blog_translation_save', 'nesso_lms_blog_translation_nonce' );

    $title_en   = get_post_meta( $post->ID, '_nesso_lms_title_en', true );
    $content_en = get_post_meta( $post->ID, '_nesso_lms_content_en', true );
    ?>
    <div class="nesso-lms-blog-translation-fields">
        <p>
            <label for="nesso_lms_title_en"><strong>Tiêu đề tiếng Anh</strong></label>
            <input
                type="text"
                id="nesso_lms_title_en"
                name="nesso_lms_title_en"
                value="<?php echo esc_attr( $title_en ); ?>"
                style="width:100%;margin-top:6px;"
            >
        </p>
        <p><strong>Nội dung tiếng Anh</strong></p>
        <?php
        wp_editor(
            $content_en,
            'nesso_lms_content_en',
            array(
                'textarea_name' => 'nesso_lms_content_en',
                'textarea_rows' => 14,
                'media_buttons' => true,
                'teeny'         => false,
                'quicktags'     => true,
                'tinymce'       => true,
            )
        );
        ?>
        <p style="color:#646970;margin-top:10px;">
            Editor chính phía trên là bản tiếng Việt. Khu vực này chỉ nhập tiêu đề và nội dung tiếng Anh tương ứng.
        </p>
    </div>
    <?php
}

add_action( 'save_post_lms_post', 'nesso_lms_blog_save_translation_meta', 10, 2 );
function nesso_lms_blog_save_translation_meta( $post_id, $post ) {
    if ( ! isset( $_POST['nesso_lms_blog_translation_nonce'] )
        || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nesso_lms_blog_translation_nonce'] ) ), 'nesso_lms_blog_translation_save' )
    ) {
        return;
    }

    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }

    if ( ! $post instanceof WP_Post || 'lms_post' !== $post->post_type ) {
        return;
    }

    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    $fields = array(
        '_nesso_lms_title_en'   => isset( $_POST['nesso_lms_title_en'] ) ? sanitize_text_field( wp_unslash( $_POST['nesso_lms_title_en'] ) ) : '',
        '_nesso_lms_content_en' => isset( $_POST['nesso_lms_content_en'] ) ? wp_kses_post( wp_unslash( $_POST['nesso_lms_content_en'] ) ) : '',
    );

    delete_post_meta( $post_id, '_nesso_lms_excerpt_en' );

    foreach ( $fields as $key => $value ) {
        if ( '' === trim( (string) $value ) ) {
            delete_post_meta( $post_id, $key );
        } else {
            update_post_meta( $post_id, $key, $value );
        }
    }
}

foreach ( nesso_lms_blog_translation_taxonomies() as $nesso_lms_blog_translation_taxonomy ) {
    add_action( "{$nesso_lms_blog_translation_taxonomy}_add_form_fields", 'nesso_lms_blog_category_translation_add_field' );
    add_action( "{$nesso_lms_blog_translation_taxonomy}_edit_form_fields", 'nesso_lms_blog_category_translation_edit_field', 10, 2 );
    add_action( "created_{$nesso_lms_blog_translation_taxonomy}", 'nesso_lms_blog_save_category_translation' );
    add_action( "edited_{$nesso_lms_blog_translation_taxonomy}", 'nesso_lms_blog_save_category_translation' );
}
unset( $nesso_lms_blog_translation_taxonomy );

function nesso_lms_blog_category_translation_add_field( $taxonomy ) {
    ?>
    <div class="form-field term-nesso-lms-name-en-wrap">
        <label for="nesso_lms_name_en">Tên danh mục tiếng Anh</label>
        <input type="text" id="nesso_lms_name_en" name="nesso_lms_name_en" value="">
        <p>Để trống nếu muốn frontend dùng tên danh mục tiếng Việt.</p>
    </div>
    <?php
}

function nesso_lms_blog_category_translation_edit_field( $term, $taxonomy ) {
    $name_en = get_term_meta( $term->term_id, '_nesso_lms_name_en', true );
    ?>
    <tr class="form-field term-nesso-lms-name-en-wrap">
        <th scope="row"><label for="nesso_lms_name_en">Tên danh mục tiếng Anh</label></th>
        <td>
            <input type="text" id="nesso_lms_name_en" name="nesso_lms_name_en" value="<?php echo esc_attr( $name_en ); ?>">
            <p class="description">Để trống nếu muốn frontend dùng tên danh mục tiếng Việt.</p>
        </td>
    </tr>
    <?php
}

function nesso_lms_blog_save_category_translation( $term_id ) {
    if ( ! isset( $_POST['nesso_lms_name_en'] ) ) {
        return;
    }

    $name_en = sanitize_text_field( wp_unslash( $_POST['nesso_lms_name_en'] ) );

    if ( '' === trim( $name_en ) ) {
        delete_term_meta( $term_id, '_nesso_lms_name_en' );
    } else {
        update_term_meta( $term_id, '_nesso_lms_name_en', $name_en );
    }
}

add_action( 'rest_api_init', 'nesso_lms_blog_register_translation_rest_fields' );
function nesso_lms_blog_register_translation_rest_fields() {
    register_post_meta(
        'lms_post',
        '_nesso_lms_title_en',
        array(
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => false,
            'sanitize_callback' => 'sanitize_text_field',
            'auth_callback'     => '__return_true',
        )
    );

    register_post_meta(
        'lms_post',
        '_nesso_lms_content_en',
        array(
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => false,
            'sanitize_callback' => 'wp_kses_post',
            'auth_callback'     => '__return_true',
        )
    );

    register_rest_field(
        'lms_post',
        'nesso_translations',
        array(
            'get_callback' => 'nesso_lms_blog_get_post_translations_rest',
            'schema'       => array(
                'description' => 'Vietnamese and English content for the LMS blog frontend.',
                'type'        => 'object',
                'context'     => array( 'view', 'edit' ),
            ),
        )
    );

    foreach ( nesso_lms_blog_translation_taxonomies() as $taxonomy ) {
        register_term_meta(
            $taxonomy,
            '_nesso_lms_name_en',
            array(
                'type'              => 'string',
                'single'            => true,
                'show_in_rest'      => false,
                'sanitize_callback' => 'sanitize_text_field',
                'auth_callback'     => '__return_true',
            )
        );

        register_rest_field(
            $taxonomy,
            'nesso_name_en',
            array(
                'get_callback' => 'nesso_lms_blog_get_category_name_en_rest',
                'schema'       => array(
                    'description' => 'English LMS category name for the LMS blog frontend.',
                    'type'        => 'string',
                    'context'     => array( 'view', 'edit' ),
                ),
            )
        );
    }
}

function nesso_lms_blog_get_rest_object_id( $object ) {
    if ( is_array( $object ) && isset( $object['id'] ) ) {
        return absint( $object['id'] );
    }

    if ( is_object( $object ) && isset( $object->ID ) ) {
        return absint( $object->ID );
    }

    if ( is_object( $object ) && isset( $object->id ) ) {
        return absint( $object->id );
    }

    return 0;
}

function nesso_lms_blog_render_content_for_rest( $content ) {
    $content = trim( (string) $content );

    if ( '' === $content ) {
        return '';
    }

    return apply_filters( 'the_content', $content );
}

function nesso_lms_blog_get_excerpt_from_content( $content, $limit = 180 ) {
    $text = wp_strip_all_tags( strip_shortcodes( (string) $content ), true );
    $text = trim( preg_replace( '/\s+/u', ' ', $text ) );

    if ( $limit > 0 && function_exists( 'mb_strlen' ) && mb_strlen( $text, 'UTF-8' ) > $limit ) {
        return mb_substr( $text, 0, $limit - 3, 'UTF-8' ) . '...';
    }

    if ( $limit > 0 && strlen( $text ) > $limit ) {
        return substr( $text, 0, $limit - 3 ) . '...';
    }

    return $text;
}

function nesso_lms_blog_get_post_translations_rest( $object, $field_name = '', $request = null ) {
    $post_id = nesso_lms_blog_get_rest_object_id( $object );
    $post    = $post_id ? get_post( $post_id ) : null;

    if ( ! $post instanceof WP_Post ) {
        return array(
            'vi'       => array(),
            'en'       => array(),
            'has_en'   => false,
            'fallback' => true,
        );
    }

    $title_vi       = get_the_title( $post );
    $content_vi_raw = get_post_field( 'post_content', $post_id );
    $excerpt_vi_raw = has_excerpt( $post ) ? get_the_excerpt( $post ) : nesso_lms_blog_get_excerpt_from_content( $content_vi_raw );
    $content_vi     = nesso_lms_blog_render_content_for_rest( $content_vi_raw );
    $excerpt_vi     = wpautop( $excerpt_vi_raw );

    $title_en_raw   = get_post_meta( $post_id, '_nesso_lms_title_en', true );
    $content_en_raw = get_post_meta( $post_id, '_nesso_lms_content_en', true );

    $has_en = '' !== trim( (string) $title_en_raw )
        || '' !== trim( (string) $content_en_raw );

    $title_en   = '' !== trim( (string) $title_en_raw ) ? $title_en_raw : $title_vi;
    $excerpt_en = '' !== trim( (string) $content_en_raw )
        ? wpautop( nesso_lms_blog_get_excerpt_from_content( $content_en_raw ) )
        : $excerpt_vi;
    $content_en = '' !== trim( (string) $content_en_raw )
        ? nesso_lms_blog_render_content_for_rest( $content_en_raw )
        : $content_vi;

    return array(
        'vi'       => array(
            'title'   => array( 'rendered' => $title_vi ),
            'excerpt' => array( 'rendered' => $excerpt_vi ),
            'content' => array( 'rendered' => $content_vi ),
        ),
        'en'       => array(
            'title'   => array( 'rendered' => $title_en ),
            'excerpt' => array( 'rendered' => $excerpt_en ),
            'content' => array( 'rendered' => $content_en ),
        ),
        'has_en'   => $has_en,
        'fallback' => ! $has_en,
    );
}

function nesso_lms_blog_get_category_name_en_rest( $object, $field_name = '', $request = null ) {
    $term_id = nesso_lms_blog_get_rest_object_id( $object );

    if ( ! $term_id ) {
        return '';
    }

    return (string) get_term_meta( $term_id, '_nesso_lms_name_en', true );
}

add_action('rest_api_init', 'nesso_lms_register_contact_mail_route');
function nesso_lms_register_contact_mail_route() {
    register_rest_route('nesso-lms/v1', '/contact', array(
        'methods'             => WP_REST_Server::CREATABLE,
        'callback'            => 'nesso_lms_handle_contact_mail',
        'permission_callback' => '__return_true',
    ));
}

function nesso_lms_get_rest_text_param( $request, $key ) {
    $value = $request->get_param( $key );

    if ( is_array( $value ) ) {
        return '';
    }

    return sanitize_text_field( wp_unslash( (string) $value ) );
}

function nesso_lms_handle_contact_mail( WP_REST_Request $request ) {
    $name       = nesso_lms_get_rest_text_param( $request, 'name' );
    $email      = sanitize_email( wp_unslash( (string) $request->get_param( 'email' ) ) );
    $website    = nesso_lms_get_rest_text_param( $request, 'website' );
    $service    = nesso_lms_get_rest_text_param( $request, 'service' );
    $message    = sanitize_textarea_field( wp_unslash( (string) $request->get_param( 'message' ) ) );
    $acceptance = nesso_lms_get_rest_text_param( $request, 'acceptance' );
    $page       = esc_url_raw( wp_unslash( (string) $request->get_param( 'page' ) ) );
    $referrer   = esc_url_raw( wp_unslash( (string) $request->get_param( 'referrer' ) ) );
    $utm_source = nesso_lms_get_rest_text_param( $request, 'utm_source' );
    $utm_medium = nesso_lms_get_rest_text_param( $request, 'utm_medium' );
    $utm_campaign = nesso_lms_get_rest_text_param( $request, 'utm_campaign' );

    if ( empty( $name ) || empty( $email ) || ! is_email( $email ) || empty( $acceptance ) ) {
        return new WP_Error(
            'nesso_lms_contact_invalid',
            'Vui lòng nhập đầy đủ họ tên, email hợp lệ và xác nhận đồng ý.',
            array( 'status' => 400 )
        );
    }

    $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
    if ( ! empty( $ip ) ) {
        $rate_key = 'nesso_lms_contact_mail_' . md5( $ip );
        if ( get_transient( $rate_key ) ) {
            return new WP_Error(
                'nesso_lms_contact_rate_limited',
                'Bạn vừa gửi thông tin. Vui lòng thử lại sau ít phút.',
                array( 'status' => 429 )
            );
        }
        set_transient( $rate_key, 1, 30 );
    }

    $submitted_at = wp_date( 'd/m/Y H:i:s' );
    $subject = '[NESSO LMS] Khách hàng mới gửi form tư vấn';
    $body = implode( "\n", array(
        'Có khách hàng mới gửi form tư vấn trên trang LMS.',
        '',
        'Thời gian gửi: ' . $submitted_at,
        'Họ và tên: ' . $name,
        'Email: ' . $email,
        'Website công ty: ' . ( $website ? $website : '-' ),
        'Nhu cầu tư vấn: ' . ( $service ? $service : '-' ),
        'Nội dung cần tư vấn:',
        $message ? $message : '-',
        '',
        'Trang gửi form: ' . ( $page ? $page : '-' ),
        'Referrer: ' . ( $referrer ? $referrer : '-' ),
        'UTM Source: ' . ( $utm_source ? $utm_source : '-' ),
        'UTM Medium: ' . ( $utm_medium ? $utm_medium : '-' ),
        'UTM Campaign: ' . ( $utm_campaign ? $utm_campaign : '-' ),
    ) );

    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $email,
    );

    $sent = wp_mail( 'CONTACT@NESSO.VN', $subject, $body, $headers );

    if ( ! $sent ) {
        return new WP_Error(
            'nesso_lms_contact_mail_failed',
            'Chưa gửi được email tư vấn. Vui lòng thử lại sau.',
            array( 'status' => 500 )
        );
    }

    return rest_ensure_response( array(
        'ok'      => true,
        'message' => 'Thông tin đã được gửi về CONTACT@NESSO.VN.',
    ) );
}
// functions.php
add_action( 'wp_footer', function() {

    // Không chèn last-logo/footer template vào page LMS E-Learning
    if ( is_page(4351) || is_front_page() || is_page(4282) ) {
        return;
    }

    echo '<div class="last-logo">';
    echo do_shortcode('[hfe_template id="1555"]'); 
    echo '</div>';
    ?>
    <script>
    (function () {
        var footer = document.getElementById('colophon') || document.querySelector('footer[role="contentinfo"]');
        var logo = document.querySelector('.last-logo');

        if (!footer || !logo) {
            return;
        }

        var reveal = footer.closest('.nesso-footer-reveal');

        if (!reveal) {
            reveal = document.createElement('div');
            reveal.className = 'nesso-footer-reveal';
            footer.parentNode.insertBefore(reveal, footer);
            reveal.appendChild(footer);
        }

        if (logo.parentNode !== reveal) {
            reveal.appendChild(logo);
        }

        function updateFooterLogoReveal() {
            var rect = footer.getBoundingClientRect();
            var isPastFooterAnchor = rect.bottom <= window.innerHeight + 1;
            document.body.classList.toggle('nesso-footer-logo-visible', isPastFooterAnchor);
        }

        var ticking = false;

        function requestUpdate() {
            if (ticking) {
                return;
            }

            ticking = true;
            window.requestAnimationFrame(function () {
                ticking = false;
                updateFooterLogoReveal();
            });
        }

        updateFooterLogoReveal();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        window.addEventListener('load', requestUpdate);
    })();
    </script>
    <?php

    if ( is_single() ) {
        echo '<script async src="https://static.addtoany.com/menu/page.js"></script>';
    }
});


add_action('wp_enqueue_scripts', 'enqueue_lenis_smooth_scroll', 100);

function enqueue_lenis_smooth_scroll() {
    if ( is_page(4351) ) {
        return;
    }

    // Lenis từ CDN
    wp_enqueue_script('lenis', 'https://cdn.jsdelivr.net/npm/@studio-freight/lenis@latest/dist/lenis.min.js', [], null, true);

    // Code khởi tạo Lenis
    wp_add_inline_script('lenis', "
        document.addEventListener('DOMContentLoaded', function() {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false,
                normalizeWheel: true
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            window.lenis = lenis;
        });
    ", 'after');
}
add_action('wp_head', function () {
    echo "\n<!-- NESSO_FUNCTIONS_TEST_999 -->\n";
}, 999);
add_action('wp_head', function () {
    echo "\n<!-- NESSO_FUNCTIONS_TEST_999 -->\n";
    ?>
    <style>
        #loadingOverlay,
        .loading-overlay,
        .loading-logo {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -999999 !important;
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            var loader = document.getElementById('loadingOverlay');
            if (loader) loader.remove();
        });
    </script>
    <?php
}, 1);

// add_action('template_redirect', 'nesso_start_remove_video_poster_buffer', 0);
// function nesso_start_remove_video_poster_buffer() {
//     if ( ! is_front_page() ) return;

//     ob_start(function ($html) {
//         $html = preg_replace(
//             '/\s+poster=("|\')https?:\/\/nesso\.vn\/wp-content\/uploads\/2026\/02\/Logo\.svg\1/i',
//             '',
//             $html
//         );

//         $html = preg_replace(
//             '/\s+poster=("|\')https?:\/\/www\.nesso\.vn\/wp-content\/uploads\/2026\/02\/Logo\.svg\1/i',
//             '',
//             $html
//         );

//         return $html;
//     });
// }
/* ================================ ABOUT US TEAM TOOLTIP JS ================================ */
add_action('wp_footer', function () {
    if ( ! is_page(36) ) return;
    ?>
    <script>
    (function () {
      var nessoTooltipInited = false;

      function initNessoTeamTooltip() {
        if (nessoTooltipInited) return;
        nessoTooltipInited = true;

        var table = document.querySelector('#team-table');
        var tooltip = document.querySelector('#image-tooltip');
        var imgCol = document.querySelector('.elementor-element-865509c');

        if (!table || !tooltip || !imgCol) return;

        var tooltipImg = tooltip.querySelector('img');
        if (!tooltipImg) {
          tooltipImg = document.createElement('img');
          tooltip.appendChild(tooltipImg);
        }

        var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
		var activeRow = null;
		var activeSrc = '';
		var ticking = false;
		var mobileScrollTimer = null;
		var mobileFastLoop = null;

        function isMobile() {
          return window.innerWidth <= 767;
        }

        function getAvatar(row) {
          return row ? row.querySelector('.avatar-frame img, td:nth-child(3) img') : null;
        }

        function preloadImages() {
          rows.forEach(function (row) {
            var avatar = getAvatar(row);
            if (!avatar || !avatar.src) return;

            var img = new Image();
            img.src = avatar.src;
          });
        }

        function hideTooltip() {
          tooltip.classList.remove('nesso-mobile-active');
          tooltip.classList.remove('nesso-desktop-active');

          tooltip.style.setProperty('display', 'none', 'important');

          rows.forEach(function (row) {
            row.classList.remove('nesso-mobile-row-active');
          });

          activeRow = null;
        }

        function setDesktopPosition() {
          if (isMobile()) return;

          var colRect = imgCol.getBoundingClientRect();
          var safeTop = Math.max(140, colRect.top);
          var safeLeft = Math.max(20, colRect.left);
          var safeWidth = Math.max(280, Math.min(420, colRect.width));

          tooltip.style.setProperty('position', 'fixed', 'important');
          tooltip.style.setProperty('top', safeTop + 'px', 'important');
          tooltip.style.setProperty('left', safeLeft + 'px', 'important');
          tooltip.style.setProperty('right', 'auto', 'important');
          tooltip.style.setProperty('width', safeWidth + 'px', 'important');
          tooltip.style.setProperty('max-width', '32vw', 'important');
          tooltip.style.setProperty('z-index', '99999', 'important');
          tooltip.style.setProperty('pointer-events', 'none', 'important');
          tooltip.style.setProperty('visibility', 'visible', 'important');
          tooltip.style.setProperty('opacity', '1', 'important');

          document.documentElement.style.setProperty('--team-tooltip-top', safeTop + 'px');
          document.documentElement.style.setProperty('--team-tooltip-left', safeLeft + 'px');
        }

        function setMobilePosition() {
          tooltip.style.setProperty('position', 'fixed', 'important');
          tooltip.style.setProperty('top', '92px', 'important');
          tooltip.style.setProperty('left', '12px', 'important');
          tooltip.style.setProperty('right', 'auto', 'important');
          tooltip.style.setProperty('width', '145px', 'important');
          tooltip.style.setProperty('max-width', 'none', 'important');
          tooltip.style.setProperty('min-width', '0', 'important');
          tooltip.style.setProperty('z-index', '30', 'important');
          tooltip.style.setProperty('pointer-events', 'none', 'important');
          tooltip.style.setProperty('transform', 'translateZ(0)', 'important');
          tooltip.style.setProperty('will-change', 'auto', 'important');
          tooltip.style.setProperty('display', 'block', 'important');
        }

        function showRow(row) {
          if (!row) return;

          var avatar = getAvatar(row);
          if (!avatar || !avatar.src) return;

          if (activeRow === row && activeSrc === avatar.src) {
            if (isMobile()) {
              setMobilePosition();
              tooltip.classList.add('nesso-mobile-active');
            } else {
              setDesktopPosition();
              tooltip.classList.add('nesso-desktop-active');
              tooltip.style.setProperty('display', 'block', 'important');
            }
            return;
          }

          rows.forEach(function (item) {
            item.classList.remove('nesso-mobile-row-active');
          });

          if (isMobile()) {
            row.classList.add('nesso-mobile-row-active');
          }

			if (activeSrc !== avatar.src) {
				tooltipImg.alt = avatar.alt || '';

				if (isMobile()) {
					tooltipImg.decoding = 'sync';
					tooltipImg.loading = 'eager';
				}

				tooltipImg.src = avatar.src;
				activeSrc = avatar.src;
			}

          if (isMobile()) {
            setMobilePosition();
            tooltip.classList.add('nesso-mobile-active');
            tooltip.classList.remove('nesso-desktop-active');
          } else {
            setDesktopPosition();
            tooltip.classList.add('nesso-desktop-active');
            tooltip.classList.remove('nesso-mobile-active');
            tooltip.style.setProperty('display', 'block', 'important');
          }

          activeRow = row;
        }

        function findMobileRow() {
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          var mobileTop = 92;
          var focusY = mobileTop + 34;
          var visibleRows = [];

          rows.forEach(function (row) {
            var rect = row.getBoundingClientRect();

            /*
              FIX NAME CUỐI:
              Cho phép bắt row miễn còn xuất hiện trong viewport,
              không phụ thuộc table bottom quá cao nữa.
            */
            if (rect.bottom >= 0 && rect.top <= viewportHeight - 8) {
              visibleRows.push({
                row: row,
                distance: Math.abs((rect.top + rect.height / 2) - focusY)
              });
            }
          });

          if (!visibleRows.length) return null;

          visibleRows.sort(function (a, b) {
            return a.distance - b.distance;
          });

          return visibleRows[0].row;
        }

        function updateMobile() {
          if (!isMobile()) return;

          var tableRect = table.getBoundingClientRect();
          var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          var mobileTop = 92;

          /*
            FIX NAME CUỐI:
            Trước đây dùng tableRect.bottom >= mobileTop + 80 nên cuối bảng bị tắt sớm.
            Bản này giữ tooltip tới khi bảng thật sự ra khỏi màn hình.
          */
          var shouldShowTooltip =
            tableRect.top <= mobileTop + 8 &&
            tableRect.bottom >= 0 &&
            tableRect.top < viewportHeight;

          if (!shouldShowTooltip) {
            hideTooltip();
            return;
          }

          var row = findMobileRow();

          if (!row && rows.length) {
            row = rows[0];
          }

          showRow(row);
        }

		function requestMobileUpdate() {
		  if (ticking) return;

		  ticking = true;

		  window.requestAnimationFrame(function () {
			ticking = false;
			updateMobile();
		  });
		}

		function startMobileFastLoop() {
		  if (!isMobile()) return;

		  requestMobileUpdate();

		  if (!mobileFastLoop) {
			mobileFastLoop = window.setInterval(function () {
			  updateMobile();
			}, 50);
		  }

		  window.clearTimeout(mobileScrollTimer);
		  mobileScrollTimer = window.setTimeout(function () {
			if (mobileFastLoop) {
			  window.clearInterval(mobileFastLoop);
			  mobileFastLoop = null;
			}

			updateMobile();
		  }, 180);
		}

        /*
          Desktop: chỉ hiện khi hover row.
          Không tự display:block khi scroll nữa.
        */
        table.addEventListener('mouseover', function (event) {
          if (isMobile()) return;

          var row = event.target.closest('#team-table tbody tr');
          if (!row) return;

          showRow(row);
        }, true);

        table.addEventListener('mouseleave', function () {
          if (isMobile()) return;
          hideTooltip();
        });

		window.addEventListener('scroll', function () {
		  if (isMobile()) {
			startMobileFastLoop();
		  } else {
			if (tooltip.classList.contains('nesso-desktop-active') && activeRow) {
			  setDesktopPosition();
			} else {
			  tooltip.style.setProperty('display', 'none', 'important');
			}
		  }
		}, { passive: true });

		window.addEventListener('touchmove', function () {
		  if (isMobile()) {
			startMobileFastLoop();
		  }
		}, { passive: true });

		window.addEventListener('pointermove', function () {
		  if (isMobile()) {
			startMobileFastLoop();
		  }
		}, { passive: true });

        window.addEventListener('resize', function () {
          activeRow = null;

          if (isMobile()) {
            requestMobileUpdate();
          } else {
            hideTooltip();
          }
        });

        window.addEventListener('orientationchange', function () {
          activeRow = null;
          setTimeout(requestMobileUpdate, 250);
        });

        rows.forEach(function (row) {
          row.addEventListener('touchstart', function () {
            if (!isMobile()) return;
            showRow(row);
          }, { passive: true });
        });

        preloadImages();

        setTimeout(function () {
          if (isMobile()) {
            requestMobileUpdate();
          } else {
            hideTooltip();
          }
        }, 150);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNessoTeamTooltip);
      } else {
        initNessoTeamTooltip();
      }
    })();
    </script>
    <?php
}, 999);
