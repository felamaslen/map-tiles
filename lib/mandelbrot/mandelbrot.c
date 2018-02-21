#include "mandelbrot.h"
#include "generate_png.h"

#include <stdlib.h>
#include <stdio.h>
#include <math.h>

#define MAX_ITERATIONS 110
#define RESOLUTION 256

double mandelbrot_set_test(double val_x, double val_y, double *minMu, double *maxMu) {
    int iteration = 0;
    
    double z_test_x = 0;
    double z_test_y = 0;

    double z_temp_x;

    while (pow(z_test_x, 2) + pow(z_test_y, 2) <= 4 && iteration < MAX_ITERATIONS) {
        z_temp_x = pow(z_test_x, 2) - pow(z_test_y, 2) + val_x;
        z_test_y = 2 * z_test_x * z_test_y + val_y;
        z_test_x = z_temp_x;

        iteration++;
    }

    if (iteration < MAX_ITERATIONS) {
        double modZ = sqrt(pow(z_test_x, 2) + pow(z_test_y, 2));
        double mu = iteration - (log(log(modZ))) / log(2);
        if (mu > *maxMu) {
            *maxMu = mu;
        }
        if (mu < *minMu) {
            *minMu = mu;
        }

        return mu;
    }
    
    return 0.0;
}

int generate_mandelbrot_tile(double min_x, double max_y, double tile_size) {
    int width = RESOLUTION;
    int height = RESOLUTION;
   
    int i, j;
    double val_x, val_y;

    double increment = tile_size / RESOLUTION;

    double val;
    int color;
    
    double *buffer = (double *) malloc(width * height * sizeof (double));
    if (buffer == NULL) {
        fprintf(stderr, "Couldn't create buffer\n");
        
        return 1;
    }
	
    double minMu = MAX_ITERATIONS;
	double maxMu = 0;

	for (j = 0; j < RESOLUTION; j++) {
        val_y = max_y - j * increment;

		for (i = 0; i < RESOLUTION; i++) {
            val_x = min_x + i * increment;

            val = mandelbrot_set_test(val_x, val_y, &minMu, &maxMu);

            buffer[(int)(j * width + i)] = val;
		}
	}
	
    // scale buffer values between 0 and 1
	int count = width * height;
	while (count) {
		count--;
		buffer[count] = (buffer[count] - minMu) / (maxMu - minMu);
	}

    output_png(width, height, buffer);

    free(buffer);

    return 0;
}

