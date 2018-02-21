#include "mandelbrot.h"

#include <stdio.h>

int main(int argc, char *argv[]) {
    double min_x, max_y, tile_size;

    sscanf(argv[1], "%lf", &min_x);
    sscanf(argv[2], "%lf", &max_y);
    sscanf(argv[3], "%lf", &tile_size);

    return generate_mandelbrot_tile(min_x, max_y, tile_size);
    
    // return generate_mandelbrot_tile(-0.60, 0.42, 0.002);
}

