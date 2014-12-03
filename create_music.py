import sys
import json
import random

def get_tones(peers):
  # generate random tones for each peer
  tones = {}
  for peer in peers:
    tones[peer['ip']] = random.randint(200, 800)
  return tones

def create_music(peers):
  tones = get_tones(peers)
  f = open


if __name__ == '__main__':

  if len(sys.argv) != 2:
    print 'usage: python create_music.py <filename>'
    sys.exit(1)

  filename = sys.argv[1]

  f = open(filename, 'r')
  peers = json.load(f)
  f.close()

  create_music(peers)
  
