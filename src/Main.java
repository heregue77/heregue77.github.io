import java.util.*;
import java.io.*;
import java.lang.*;
import java.math.*;

public class Main {
	public static void main(String[] args) throws IOException {
		int[] items = {7,5,6,4,2,3,7,5};
		ArrayList<Bin> arr = new ArrayList<>();
		
		Fit ff = new FirstFit();
		for(int i=0; i<items.length; i++) {
			ff.fit(arr, new Item(items[i]));
		}
		System.out.println("First Fit Bin " + arr.size()); //통의 개수
		for(int i=0;i<arr.size();i++) {
			System.out.println(arr.get(i).toString());
		}
		
		
		arr.clear();
		Fit nf = new NextFit();
		for(int i=0; i<items.length; i++) {
			nf.fit(arr, new Item(items[i]));
		}
		System.out.println("Next Fit Bin " + arr.size()); //통의 개수
		for(int i=0;i<arr.size();i++) {
			System.out.println(arr.get(i).toString());
		}
		
		
		arr.clear();
		Fit bf = new BestFit();
		for(int i=0; i<items.length; i++) {
			bf.fit(arr, new Item(items[i]));
		}
		System.out.println("Best Fit Bin " + arr.size()); //통의 개수
		for(int i=0;i<arr.size();i++) {
			System.out.println(arr.get(i).toString());
		}
		
		arr.clear();
		Fit wf = new WorstFit();
		for(int i=0; i<items.length; i++) {
			wf.fit(arr, new Item(items[i]));
		}
		System.out.println("Worst Fit Bin " + arr.size()); //통의 개수
		for(int i=0;i<arr.size();i++) {
			System.out.println(arr.get(i).toString());
		}
	}
}