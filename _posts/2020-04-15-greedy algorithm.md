---
layout: single
title: greedy algorithm
data: 2020-04-15 21:31:00 +0900
author: Sun Woo, Jang
---

# Ford-Fulkerson Algorithm for Maximum Flow Problem

<br />

## 알고리즘 설명

모든 엣지에 용량이 있는 흐름 연결도를 나타내는 그래프가 제공된다. 그래프에서 두 개의 정점 소스's'와 싱크't'가 주어지면 다음 제약 조건을 사용하여 s에서 t까지 가능한 최대 흐름을 찾아라.

제약조건

a) 모서리의 흐름이 지정된 모서리 용량을 초과하지 않는다.

b) 들어오는 흐름은 s와 t를 제외한 모든 정점의 나가는 흐름과 같다.

<br />

예시 그림

![algorithm1](https://user-images.githubusercontent.com/62889604/79385005-d993e800-7fa2-11ea-853e-1f4260bcecc4.png)

위와 같은 그림이 있을 때, 가능한 최대 흐름은 아래와 같다.

![algorithm2](https://user-images.githubusercontent.com/62889604/79385013-ddc00580-7fa2-11ea-834b-7f0f69a85bae.png)

이런식으로 미리 정해진 흐름을 넘지 않으면서 최대의 흐름을 만들어내면 23이라는 흐름이 된다.

<br />

### 간단한 아이디어

1) 초기 흐름을 0으로 시작

2) 소스에서 싱크로 증가하는 경로가 있는 동안 이 경로 흐름을 흐름에 추가

3) 흐름을 리턴

<br />

시간 복잡도 : O(max_flow * E) (max_flow : 최대 경로, E : 엣지)

증가하는 경로가 있는 동안 루프를 실행하는데, 최악의 경우 반복할 때 마다 1 단위 흐름을 추가할 수 있다. 따라서 시간 복잡도는 O(max_flow * E)

구현을 이해하는데 Residual graph 개념이 필요한데 흐름 연결도에서  Residual graph란 추가 가능한 흐름을 나타내는 그래프이다. Residual graph에 소스에서 싱크까지의 경로가 있을 때, 흐름을 추가할 수 있다. Residual graph의 모든 가장자리에는 Residual capacity(용량)이라는 값이 있으며, 이는 가장자리의 원래 용량에서 흐름을 뺀 값과 같다. Residual capacity는 기본적으로 엣지의 현재 용량이다.

구현 세부사항을 보면, Residual graph의 두 정점 사이에 엣지가 없는 경우 Residual capacity는 0이다. 초기 흐름이 없고, 초기 Residual capacity가 원래 용량과 같으므로, Residual graph를 원래 그래프로 초기화 할 수 있다. 기능 보강 경로를 찾기 위해 Residual graph BFS 혹은 DFS를 수행 할 수 있다. 아래 구현에서 BFS를 사용했다. BFS를 사용하면 소스에서 싱크까지 경로가 있는지 확인할 수 있다. BFS는 parent배열을 작성하는데 이 배열을 사용해서 찾은 경로를 통과하고, 경로를 따라 최소 Residual capacity를 찾아 가능한 흐름을 찾는다. 나중에 찾은 경로 흐름을 전체 흐름에 추가 한다. 

여기서 중요한 것은 Residual graph에서 Residual capacity 값을 계속해서 업데이트 해줘야 한다는 것이다. 경로를 따라 모든 엣지에서 경로 흐름을 빼고, 후면 엣지를 따라 경로 흐름을 추가한다. 나중에 반대 방향으로 보내야 할 수도 있어야 하므로 역방향 엣지를 따라 흐름을 추가해야 한다.

<br />

아래 코드는 이 알고리즘이 설명되어 있는 외국 사이트에서 따온 것이다.

```java
// Java program for implementation of Ford Fulkerson algorithm 
import java.util.*; 
import java.lang.*; 
import java.io.*; 
import java.util.LinkedList; 
  
class MaxFlow 
{ 
    static final int V = 6;    //Number of vertices in graph 
  
    /* Returns true if there is a path from source 's' to sink 
      't' in residual graph. Also fills parent[] to store the 
      path */
    boolean bfs(int rGraph[][], int s, int t, int parent[]) 
    { 
        // Create a visited array and mark all vertices as not 
        // visited 
        boolean visited[] = new boolean[V]; 
        for(int i=0; i<V; ++i) 
            visited[i]=false; 
  
        // Create a queue, enqueue source vertex and mark 
        // source vertex as visited 
        LinkedList<Integer> queue = new LinkedList<Integer>(); 
        queue.add(s); 
        visited[s] = true; 
        parent[s]=-1; 
  
        // Standard BFS Loop 
        while (queue.size()!=0) 
        { 
            int u = queue.poll(); 
  
            for (int v=0; v<V; v++) 
            { 
                if (visited[v]==false && rGraph[u][v] > 0) 
                { 
                    queue.add(v); 
                    parent[v] = u; 
                    visited[v] = true; 
                } 
            } 
        } 
  
        // If we reached sink in BFS starting from source, then 
        // return true, else false 
        return (visited[t] == true); 
    } 
  
    // Returns tne maximum flow from s to t in the given graph 
    int fordFulkerson(int graph[][], int s, int t) 
    { 
        int u, v; 
  
        // Create a residual graph and fill the residual graph 
        // with given capacities in the original graph as 
        // residual capacities in residual graph 
  
        // Residual graph where rGraph[i][j] indicates 
        // residual capacity of edge from i to j (if there 
        // is an edge. If rGraph[i][j] is 0, then there is 
        // not) 
        int rGraph[][] = new int[V][V]; 
  
        for (u = 0; u < V; u++) 
            for (v = 0; v < V; v++) 
                rGraph[u][v] = graph[u][v]; 
  
        // This array is filled by BFS and to store path 
        int parent[] = new int[V]; 
  
        int max_flow = 0;  // There is no flow initially 
  
        // Augment the flow while tere is path from source 
        // to sink 
        while (bfs(rGraph, s, t, parent)) 
        { 
            // Find minimum residual capacity of the edhes 
            // along the path filled by BFS. Or we can say 
            // find the maximum flow through the path found. 
            int path_flow = Integer.MAX_VALUE; 
            for (v=t; v!=s; v=parent[v]) 
            { 
                u = parent[v]; 
                path_flow = Math.min(path_flow, rGraph[u][v]); 
            } 
  
            // update residual capacities of the edges and 
            // reverse edges along the path 
            for (v=t; v != s; v=parent[v]) 
            { 
                u = parent[v]; 
                rGraph[u][v] -= path_flow; 
                rGraph[v][u] += path_flow; 
            } 
  
            // Add path flow to overall flow 
            max_flow += path_flow; 
        } 
  
        // Return the overall flow 
        return max_flow; 
    } 
  
    // Driver program to test above functions 
    public static void main (String[] args) throws java.lang.Exception 
    { 
        // Let us create a graph shown in the above example 
        int graph[][] =new int[][] { {0, 16, 13, 0, 0, 0}, 
                                     {0, 0, 10, 12, 0, 0}, 
                                     {0, 4, 0, 0, 14, 0}, 
                                     {0, 0, 9, 0, 0, 20}, 
                                     {0, 0, 0, 7, 0, 4}, 
                                     {0, 0, 0, 0, 0, 0} 
                                   }; 
        MaxFlow m = new MaxFlow(); 
  
        System.out.println("The maximum possible flow is " + 
                           m.fordFulkerson(graph, 0, 5)); 
  
    } 
} 
```

