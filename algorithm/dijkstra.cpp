#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

const int INF = 1e9;

int main() {
    int rows, cols;
    if (!(cin >> rows >> cols)) {
        cout << "{\n  \"error\": \"Invalid input\"\n}\n";
        return 1;
    }

    vector<vector<int>> grid(rows, vector<int>(cols));
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            cin >> grid[i][j];
        }
    }

    int startR, startC, endR, endC;
    cin >> startR >> startC >> endR >> endC;

    if (startR < 0 || startR >= rows || startC < 0 || startC >= cols ||
        endR < 0 || endR >= rows || endC < 0 || endC >= cols) {
        cout << "{\n  \"error\": \"Coordinates out of bounds\"\n}\n";
        return 1;
    }

    vector<vector<int>> distArray(rows, vector<int>(cols, INF));
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    vector<vector<int>> parentRow(rows, vector<int>(cols, -1));
    vector<vector<int>> parentCol(rows, vector<int>(cols, -1));

    int dRow[] = {-1, 1, 0, 0};
    int dCol[] = {0, 0, -1, 1};

    distArray[startR][startC] = 0;
    int nodesVisited = 0;

    for (int count = 0; count < rows * cols; ++count) {
        int minD = INF;
        int uR = -1, uC = -1;

        for (int i = 0; i < rows; ++i) {
            for (int j = 0; j < cols; ++j) {
                if (!visited[i][j] && distArray[i][j] < minD) {
                    minD = distArray[i][j];
                    uR = i;
                    uC = j;
                }
            }
        }

        if (uR == -1 || uC == -1) break;

        visited[uR][uC] = true;
        nodesVisited++;

        if (uR == endR && uC == endC) break;

        for (int i = 0; i < 4; ++i) {
            int nR = uR + dRow[i];
            int nC = uC + dCol[i];

            if (nR >= 0 && nR < rows && nC >= 0 && nC < cols) {
                if (!visited[nR][nC] && grid[nR][nC] == 0) {
                    if (distArray[uR][uC] + 1 < distArray[nR][nC]) {
                        distArray[nR][nC] = distArray[uR][uC] + 1;
                        parentRow[nR][nC] = uR;
                        parentCol[nR][nC] = uC;
                    }
                }
            }
        }
    }

    int totalDistance = distArray[endR][endC];
    vector<pair<int, int>> path;

    if (totalDistance != INF) {
        int cR = endR;
        int cC = endC;
        while (cR != -1 && cC != -1) {
            path.push_back({cR, cC});
            int pR = parentRow[cR][cC];
            int pC = parentCol[cR][cC];
            cR = pR;
            cC = pC;
        }
    }

    reverse(path.begin(), path.end());

    cout << "{\n";
    cout << "  \"distance\": " << (totalDistance == INF ? -1 : totalDistance) << ",\n";
    cout << "  \"nodesVisited\": " << nodesVisited << ",\n";
    cout << "  \"path\": [\n";
    for (size_t i = 0; i < path.size(); ++i) {
        cout << "    [\n      " << path[i].first << ",\n      " << path[i].second << "\n    ]";
        if (i < path.size() - 1) cout << ",";
        cout << "\n";
    }
    cout << "  ]\n";
    cout << "}\n";

    return 0;
}
