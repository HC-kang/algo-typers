import { CodeSnippet } from '@/types/CodeSnippet';

let currentSnippet: CodeSnippet | null = null;

export async function getRandomCodeSnippets(): Promise<CodeSnippet[]> {
  if (!currentSnippet) {
    currentSnippet = await CodeSnippet.fetchRandomSnippet();
  }
  return [currentSnippet];
}

export const codeSnippets: CodeSnippet[] = [
  {
    id: 'median-finder',
    title: 'Find Median from Data Stream',
    code: `class MedianFinder {
  private nums: number[] = [];

  addNum(num: number): void {
    if (this.nums.length === 0) {
      this.nums.push(num);
      return;
    } else {
      this.putNumWithBinarySearch(num);
    }
  }

  private putNumWithBinarySearch(num: number): void {
    let left = 0;
    let right = this.nums.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.nums[mid] === num) {
        this.nums.splice(mid, 0, num);
        return;
      } else if (this.nums[mid] < num) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    this.nums.splice(left, 0, num);
  }

  findMedian(): number {
    const len = this.nums.length;
    if (len % 2 === 1) {
      return this.nums[Math.floor(len / 2)];
    } else {
      return (this.nums[len / 2] + this.nums[len / 2 - 1]) / 2;
    }
  }
}`,
    source: 'leetcode.com/problems/find-median-from-data-stream',
    lang: "typescript"
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    code: `function climbStairs(n: number): number {
  let p = 0;
  let q = 1;
  for (let i = 0; i < n; i++) {
    q = q + p;
    p = q - p;
  }
  return q;
}`,
    source: 'leetcode.com/problems/climbing-stairs',
    lang: "typescript"
  },
  {
    id: 'three-sum',
    title: '3Sum',
    code: `function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum == 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] == nums[left + 1]) left++;
        while (left < right && nums[right] == nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
    source: 'leetcode.com/problems/3sum',
    lang: "typescript"
  }
]; 