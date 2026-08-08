#include <stdio.h>
int main()
{
    int data[4];
    int hamming[7];
    printf("Enter the 4 data bits: ");
    for(int i = 0; i < 4; i++)
    {
        scanf("%d", &data[i]);
    }
    hamming[2] = data[0];
    hamming[4] = data[1];
    hamming[5] = data[2];
    hamming[6] = data[3];
    
    hamming[0] = hamming[2] ^ hamming[4] ^ hamming[6];
    hamming[1] = hamming[2] ^ hamming[5] ^ hamming[6];
    hamming[2] = hamming[4] ^ hamming[5] ^ hamming[6];
    
    printf("hamming code : ");
    
    for ( int i = 0 ; i<7 ; i++){
        
        printf("%d",hamming[i]);
    }
    return 0;
}