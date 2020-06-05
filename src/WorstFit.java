import java.util.ArrayList;

public class WorstFit implements Fit {
	@Override
	public void fit(ArrayList<Bin> arr, Item item) {
		int idx=-1;
		int temp=0;
		for(int i=0;i<arr.size();i++) {
			Bin bin = arr.get(i);
            if(bin.check(item)) {
            	if(temp < bin.remainCapacity) {
            		temp = bin.remainCapacity;
            		idx = i;
            	}
            }
		}

		if(idx==-1) {
			Bin b = new Bin();
			b.update(item);
			arr.add(b);
		}
		else {
			Bin b = arr.get(idx);
			b.update(item);
		}
	}
}
