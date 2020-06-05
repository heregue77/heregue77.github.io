import java.util.ArrayList;

public class NextFit implements Fit {
	@Override
	public void fit(ArrayList<Bin> arr, Item item) {
		if(arr.size() > 0) {
			Bin bin = arr.get(arr.size()-1);
			if(bin.check(item)) {
				bin.update(item);
				return;
			}
			
			Bin b = new Bin();
			b.update(item);
			arr.add(b);
		}
		
		else {
			Bin b = new Bin();
			b.update(item);
			arr.add(b);
		}
	}

}
