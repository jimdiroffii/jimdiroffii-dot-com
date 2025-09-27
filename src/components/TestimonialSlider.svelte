<script context="module" lang="ts">
    export type AvatarAttrs = {
        alt: string;
        src: string;
        srcset?: string;
        width?: number;
        height?: number;
        loading?: "lazy" | "eager";
        decoding?: "async" | "sync" | "auto";
    };
</script>

<script lang="ts">
    import { onMount } from "svelte";

    interface Testimonial {
        name: string;
        position: string;
        testimonial: string;
        profileImage: AvatarAttrs;
    }

    export let testimonials: Testimonial[] = [];
    export let autoPlay: boolean = true;
    export let autoPlayDelay: number = 500;

    let currentIndex = 0;
    let isTransitioning = false;
    let autoPlayInterval: NodeJS.Timeout | null = null;

    const nextTestimonial = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex = (currentIndex + 1) % testimonials.length;
        setTimeout(() => (isTransitioning = false), 300);
    };

    const prevTestimonial = () => {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex =
            currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
        setTimeout(() => (isTransitioning = false), 300);
    };

    const goToTestimonial = (index: number) => {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        currentIndex = index;
        setTimeout(() => (isTransitioning = false), 300);
    };

    const startAutoPlay = () => {
        if (autoPlay && testimonials.length > 1) {
            autoPlayInterval = setInterval(nextTestimonial, autoPlayDelay);
        }
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    onMount(() => {
        startAutoPlay();
        return () => stopAutoPlay();
    });

    $: currentTestimonial = testimonials[currentIndex];
</script>

<section
    class="relative isolate overflow-hidden px-6 py-2 my-1"
    on:mouseenter={stopAutoPlay}
    on:mouseleave={startAutoPlay}
    aria-label="Customer testimonials"
>
    <!-- Background gradients -->
    <div
        class="absolute rounded-4xl inset-0 -z-10 bg-[radial-gradient(40rem_50rem_at_top,theme(colors.blue.800),transparent)] dark:bg-[radial-gradient(40rem_50rem_at_top,theme(colors.indigo.500),transparent)] opacity-15"
    ></div>

    <!-- Testimonial Content -->
    <div class="mx-auto max-w-2xl lg:max-w-4xl">
        {#if currentTestimonial}
            <figure class="mt-4">
                <!-- Fixed height testimonial text area -->
                <div
                    class="flex items-center justify-center h-60 sm:h-48 md:h-40 lg:h-32 overflow-hidden"
                >
                    <div
                        class="transition-all duration-300 ease-in-out w-full"
                        class:opacity-90={isTransitioning}
                    >
                        <blockquote class="text-center text-xl/8 sm:text-2xl/9">
                            <p>"{currentTestimonial.testimonial}"</p>
                        </blockquote>
                    </div>
                </div>

                <!-- Fixed position for profile and navigation -->
                <figcaption class="mt-4">
                    <img
                        src={currentTestimonial.profileImage.src}
                        srcset={currentTestimonial.profileImage.srcset}
                        width={currentTestimonial.profileImage.width}
                        height={currentTestimonial.profileImage.height}
                        loading={currentTestimonial.profileImage.loading}
                        decoding={currentTestimonial.profileImage.decoding}
                        alt={currentTestimonial.profileImage.alt}
                        class="mx-auto size-40 rounded-full object-cover shadow-lg"
                    />
                    <div class="mt-4 flex flex-col items-center">
                        <div class="font-semibold text-xl">
                            {currentTestimonial.name}
                        </div>
                        <div class="italic text-sm">
                            {currentTestimonial.position}
                        </div>
                    </div>
                </figcaption>
            </figure>
        {/if}

        <!-- Navigation Controls -->
        {#if testimonials.length > 1}
            <div class="mt-6 flex items-center justify-center space-x-6">
                <!-- Previous Button -->
                <button
                    on:click={prevTestimonial}
                    class="group flex h-10 w-10 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 transition-all hover:bg-black/20 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Previous testimonial"
                >
                    <svg
                        class="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>

                <!-- Dot Indicators -->
                <div class="flex space-x-2">
                    {#each testimonials as _, index}
                        <button
                            on:click={() => goToTestimonial(index)}
                            class="h-2 w-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 {index ===
                            currentIndex
                                ? 'bg-black dark:bg-white scale-125'
                                : 'bg-black/30 hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/50'}"
                            aria-label="Go to testimonial {index + 1}"
                        ></button>
                    {/each}
                </div>

                <!-- Next Button -->
                <button
                    on:click={nextTestimonial}
                    class="group flex h-10 w-10 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 transition-all hover:bg-black/20 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label="Next testimonial"
                >
                    <svg
                        class="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        {/if}
    </div>
</section>

<style>
    button:focus {
        outline: none;
    }
</style>